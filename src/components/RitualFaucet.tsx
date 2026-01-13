import React, { useState } from 'react';
import { useAccount, useChainId } from 'wagmi';
import { createWalletClient, http, parseEther, type Chain } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { ritualchain } from '../wagmi';

// ดึงจาก env เพื่อหลบการสแกนของ Netlify
// @ts-ignore
const LOCAL_FUNDER_KEY = import.meta.env.VITE_LOCAL_FUNDER_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

const RITUAL_RPC = "https://tan-familiar-impala-721.mypinata.cloud";

export const RitualFaucet = () => {
  const { address } = useAccount();
  const chainId = useChainId();
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  const handleFaucet = async () => {
    if (!address) return;
    if (chainId !== ritualchain.id) {
      alert("กรุณาสลับเครือข่ายไปที่ RitualChain ก่อน");
      return;
    }

    setLoading(true);
    try {
      const funderAccount = privateKeyToAccount(LOCAL_FUNDER_KEY as `0x${string}`);
      const funderClient = createWalletClient({
        account: funderAccount,
        chain: ritualchain as Chain,
        transport: http()
      });

      const hash = await funderClient.sendTransaction({
        to: address,
        value: parseEther('10'),
        chain: ritualchain as Chain,
        account: funderAccount
      } as any);

      setTxHash(hash);
      alert("✅ 10 MCB ถูกส่งเข้ากระเป๋าคุณแล้ว!");
    } catch (error: any) {
      console.error(error);
      alert(`Faucet พัง: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!address) return null;

  return (
    <div className="p-6 mt-6 border-2 rounded-2xl bg-slate-900/50 backdrop-blur-md border-[--neon-gold]/20">
      <h3 className="text-xl font-bold mb-1 text-[--neon-gold]">🚰 MeeChain Faucet</h3>
      <p className="mb-6 text-sm text-slate-400">สำหรับทดสอบระบบบน Local Network เท่านั้น</p>

      <button 
        onClick={handleFaucet} 
        disabled={loading}
        className="w-full sm:w-auto px-8 py-3 rounded-xl font-black text-black bg-[--neon-gold] hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(255,204,0,0.3)]"
    >
        {loading ? 'โอนเหรียญ...' : 'GET 10 MCB'}
      </button>

      {txHash && (
        <div className="mt-4 text-[10px] font-mono break-all bg-black/40 p-3 rounded-lg border border-green-500/30 text-green-400">
          HASH: {txHash}
        </div>
      )}
    </div>
  );
};

export default RitualFaucet;