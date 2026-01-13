import React, { useState } from "react";
import { useAccount, useWriteContract, useReadContract } from "wagmi";
import { parseUnits, formatUnits } from "viem";
import { MeeBotStakingAbi } from "../abi/MeeBotStaking";
import { ERC20Abi } from "../abi/ERC20";
import { CONTRACT_ADDRESSES } from "../constants/addresses";
import { useCelebration } from "../context/CelebrationContext";
import { useTranslation } from "../utils/TranslationProvider";
import { playStakeSound, playUnstakeSound, playClaimSound } from "../utils/sounds";

const StakingPage: React.FC = () => {
  const { address } = useAccount();
  const { triggerCelebration } = useCelebration();
  const { writeContractAsync, isPending } = useWriteContract();
  const [amount, setAmount] = useState("");
  const { t } = useTranslation();
  
  // Read Staked Balance
  const { data: balanceData } = useReadContract({
    address: CONTRACT_ADDRESSES.MeeBotStaking as `0x${string}`,
    abi: MeeBotStakingAbi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
  });

  // Read Rewards
  const { data: rewardsData } = useReadContract({
    address: CONTRACT_ADDRESSES.MeeBotStaking as `0x${string}`,
    abi: MeeBotStakingAbi,
    functionName: "earnedRewards",
    args: address ? [address] : undefined,
  });

  // Read Allowance
  const { data: allowanceData } = useReadContract({
    address: CONTRACT_ADDRESSES.MeeToken as `0x${string}`,
    abi: ERC20Abi,
    functionName: "allowance",
    args: address ? [address, CONTRACT_ADDRESSES.MeeBotStaking] : undefined,
  });

  const stakedBalance = balanceData ? formatUnits(balanceData as bigint, 18) : "0";
  const rewards = rewardsData ? formatUnits(rewardsData as bigint, 18) : "0";
  const currentAllowance = allowanceData as bigint || BigInt(0);

  const handleClaim = async () => {
    try {
      await writeContractAsync({
        address: CONTRACT_ADDRESSES.MeeBotStaking as `0x${string}`,
        abi: MeeBotStakingAbi,
        functionName: "claimRewards",
      });
      playClaimSound(); // 🔊 Sound
      triggerCelebration(t("celebration.claim.success"));
    } catch {
      triggerCelebration(t("celebration.claim.fail"));
    }
  };

  const handleStake = async () => {
    if(!amount) return;
    try {
        const amountWei = parseUnits(amount, 18);
        
        // Check Allowance
        if (currentAllowance < amountWei) {
            triggerCelebration("⏳ Approving MCB tokens...");
            await writeContractAsync({
                address: CONTRACT_ADDRESSES.MeeToken as `0x${string}`,
                abi: ERC20Abi,
                functionName: "approve",
                args: [CONTRACT_ADDRESSES.MeeBotStaking, amountWei],
            });
             triggerCelebration("✅ Approved! Click Stake again.");
             refetchAllowance();
             return;
        }

        await writeContractAsync({
            address: CONTRACT_ADDRESSES.MeeBotStaking as `0x${string}`,
            abi: MeeBotStakingAbi,
            functionName: "stake",
            args: [amountWei]
        });
        playStakeSound(); // 🔊 Sound
        triggerCelebration(t("celebration.stake.success"));
        setAmount("");
    } catch (e) {
        console.error(e);
        triggerCelebration(t("celebration.stake.fail"));
    }
  }

  const handleUnstake = async () => {
      if(!amount) return;
      try {
        await writeContractAsync({
            address: CONTRACT_ADDRESSES.MeeBotStaking as `0x${string}`,
            abi: MeeBotStakingAbi,
            functionName: "unstake",
            args: [parseUnits(amount, 18)]
        });
        playUnstakeSound(); // 🔊 Sound
        triggerCelebration(t("celebration.unstake.success"));
        setAmount("");
      } catch {
        triggerCelebration(t("celebration.unstake.fail"));
      }
  }

  return (
    <div className="max-w-4xl mx-auto py-12 grid md:grid-cols-2 gap-8">
      {/* Rewards Panel */}
      <div className="bg-meebot-surface border border-meebot-border rounded-2xl p-8 relative overflow-hidden flex flex-col justify-between">
         <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-meebot-accent to-transparent"></div>
         <div>
             <h2 className="text-2xl font-bold text-meebot-accent mb-1">⚡ {t("staking.rewards")}</h2>
             <p className="text-meebot-text-secondary text-sm">Accumulated energy from your rituals</p>
         </div>
         
         <div className="my-8 text-center">
             <span className="text-5xl font-mono font-bold text-white block tracking-tighter">
                {Number(rewards).toFixed(4)}
             </span>
             <span className="text-meebot-accent text-sm font-bold tracking-widest uppercase">MCB Tokens</span>
         </div>
         
         <div className="mb-4 text-center">
            <p className="text-sm text-meebot-text-secondary">Staked Balance</p>
            <p className="text-xl font-mono text-white">{Number(stakedBalance).toFixed(4)} MCB</p>
         </div>

         <button 
            onClick={handleClaim} 
            disabled={isPending}
            className="w-full bg-meebot-accent/10 border border-meebot-accent text-meebot-accent hover:bg-meebot-accent hover:text-white py-3 rounded-lg font-bold transition-all duration-300"
         >
            {isPending ? "Channeling..." : t("staking.claim")}
         </button>
      </div>

      {/* Action Panel */}
      <div className="bg-meebot-surface border border-meebot-border rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-meebot-text-primary mb-6">{t("staking.title")}</h2>
        
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-meebot-text-secondary mb-2">Amount to Stake/Unstake</label>
                <div className="relative">
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full bg-meebot-bg border border-meebot-border rounded-lg pl-4 pr-16 py-3 text-meebot-text-primary focus:outline-none focus:border-meebot-accent transition-colors text-right font-mono"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-meebot-text-secondary font-bold text-sm">MCB</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <button 
                    onClick={handleStake}
                    disabled={isPending || !amount}
                    className="bg-meebot-text-primary text-meebot-bg py-3 rounded-lg font-bold hover:bg-white transition-colors disabled:opacity-50"
                >
                    {t("staking.stake")}
                </button>
                <button 
                    onClick={handleUnstake}
                    disabled={isPending || !amount}
                    className="border border-meebot-border text-meebot-text-secondary py-3 rounded-lg font-bold hover:border-meebot-text-secondary hover:text-meebot-text-primary transition-colors disabled:opacity-50"
                >
                    {t("staking.unstake")}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default StakingPage;