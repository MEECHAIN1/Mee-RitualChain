import hre from "hardhat";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const { ethers } = hre as any;
  const [deployer] = await ethers.getSigners();
  console.log("⚡ Deploying contracts with account:", deployer.address);

  // 1. Deploy MeeToken (MCB)
  const MeeToken = await ethers.getContractFactory("MeeToken");
  const meeToken = await MeeToken.deploy();
  await meeToken.waitForDeployment();
  const meeTokenAddress = await meeToken.getAddress();
  console.log("💎 MeeToken (MCB) deployed to:", meeTokenAddress);

  // 2. Deploy MeeBotNFT
  const MeeBotNFT = await ethers.getContractFactory("MeeBotNFT");
  const nft = await MeeBotNFT.deploy();
  await nft.waitForDeployment();
  const nftAddress = await nft.getAddress();
  console.log("🪄 MeeBotNFT deployed to:", nftAddress);

  // 3. Deploy MeeBotStaking
  const MeeBotStaking = await ethers.getContractFactory("MeeBotStaking");
  const staking = await MeeBotStaking.deploy(meeTokenAddress, nftAddress);
  await staking.waitForDeployment();
  const stakingAddress = await staking.getAddress();
  console.log("⚡ MeeBotStaking deployed to:", stakingAddress);

  // 🔮 Export addresses to .env (Mock implementation for Node environment)
  // In a real environment, you might use dotenv to manage this more robustly
  const envPath = path.resolve(__dirname, "../.env");
  
  if (fs.existsSync(envPath)) {
      let envContent = fs.readFileSync(envPath, "utf8");
      
      const updateEnvVar = (key: string, value: string) => {
        const regex = new RegExp(`${key}=.*`);
        if (regex.test(envContent)) {
            envContent = envContent.replace(regex, `${key}=${value}`);
        } else {
            envContent += `\n${key}=${value}`;
        }
      }

      updateEnvVar("VITE_NFT_CONTRACT_ADDRESS", nftAddress);
      updateEnvVar("VITE_STAKING_CONTRACT_ADDRESS", stakingAddress);
      updateEnvVar("VITE_TOKEN_CONTRACT_ADDRESS", meeTokenAddress);
      
      fs.writeFileSync(envPath, envContent);
      console.log("✨ Updated .env with new contract addresses");
  } else {
      console.log("⚠️ .env file not found. Please manually update addresses in src/constants/addresses.ts");
      console.log(`VITE_NFT_CONTRACT_ADDRESS=${nftAddress}`);
      console.log(`VITE_STAKING_CONTRACT_ADDRESS=${stakingAddress}`);
      console.log(`VITE_TOKEN_CONTRACT_ADDRESS=${meeTokenAddress}`);
  }
}

main().catch((error) => {
  console.error(error);
  (process as any).exit(1);
});