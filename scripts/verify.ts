import hre from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  console.log("🔍 Starting the Verification Ritual...");

  // 🪄 Retrieve addresses from .env (populated by the deployment ritual)
  const nftAddress = process.env.VITE_NFT_CONTRACT_ADDRESS;
  const stakingAddress = process.env.VITE_STAKING_CONTRACT_ADDRESS;
  const tokenAddress = process.env.VITE_TOKEN_CONTRACT_ADDRESS;

  if (!nftAddress || !stakingAddress) {
    console.error("❌ Contracts not found in the void (.env). Did you deploy?");
    (process as any).exit(1);
  }

  console.log("⚡ Verifying contracts on the Ethereal Plane (Etherscan)...");

  // 1. Verify MeeBotNFT
  try {
    console.log(`\n🪄 Verifying MeeBotNFT at ${nftAddress}...`);
    await (hre as any).run("verify:verify", {
      address: nftAddress,
      constructorArguments: [],
    });
    console.log(`✅ MeeBotNFT Verified: ${nftAddress}`);
  } catch (err: any) {
    if (err.message.includes("Already Verified")) {
      console.log("✨ MeeBotNFT was already verified.");
    } else {
      console.error("❌ NFT verify failed:", err.message);
    }
  }

  // 2. Verify MeeBotStaking
  try {
    console.log(`\n⚡ Verifying MeeBotStaking at ${stakingAddress}...`);
    // Note: Staking contract constructor takes (token, nft)
    await (hre as any).run("verify:verify", {
      address: stakingAddress,
      constructorArguments: [tokenAddress, nftAddress],
    });
    console.log(`✅ MeeBotStaking Verified: ${stakingAddress}`);
  } catch (err: any) {
    if (err.message.includes("Already Verified")) {
      console.log("✨ MeeBotStaking was already verified.");
    } else {
      console.error("❌ Staking verify failed:", err.message);
    }
  }

  // 3. Verify MeeToken (Optional but recommended)
  if (tokenAddress) {
    try {
      console.log(`\n💎 Verifying MeeToken at ${tokenAddress}...`);
      await (hre as any).run("verify:verify", {
        address: tokenAddress,
        constructorArguments: [],
      });
      console.log(`✅ MeeToken Verified: ${tokenAddress}`);
    } catch (err: any) {
        if (err.message.includes("Already Verified")) {
            console.log("✨ MeeToken was already verified.");
        } else {
            console.error("❌ MeeToken verify failed:", err.message);
        }
    }
  }

  console.log("\n✨ Verification Ritual Complete! The code is now immutable and transparent.");
}

main().catch((error) => {
  console.error(error);
  (process as any).exit(1);
});