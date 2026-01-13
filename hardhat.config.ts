import "@nomicfoundation/hardhat-verify";
import * as dotenv from "dotenv";

dotenv.config();

const config = {
  solidity: "0.8.20",
  networks: {
    hardhat: {},
    ritual: {
      url: process.env.VITERPCURL || "http://127.0.0.1:8545",
      chainId: parseInt(process.env.CHAIN_ID || "1337"),
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : undefined,
    },
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || "",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : undefined,
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCANAPIKEY,
  },
};

export default config;