import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { defineChain } from "viem";
import { http } from "wagmi";
import { mainnet, sepolia, base, optimism, arbitrum, polygon, bsc } from "wagmi/chains";

// 1. นิยาม Chain ก่อน
export const ritualchain = defineChain({
  id: 13390,
  name: "RitualChain Local",
  nativeCurrency: { name: "MeeChain Coin", symbol: "MCB", decimals: 18 },
  rpcUrls: { 
    default: { http: ["https://ritual-chain--t2rawanta.replit.app"] } 
  },
  blockExplorers: {
    default: { name: "RitualScan", url: "https://ritual-scan.replit.app" }
  },
  testnet: true,
});

// 2. ตั้งค่า Config
export const config = getDefaultConfig({
  appName: "MeeChain",
  projectId: "b0d81328f8ab0541fdede7db9ff25cb1",
  chains: [ritualchain, mainnet, sepolia, base, optimism, arbitrum, polygon, bsc ],
  transports: {
    // ระบุ URL ลงไปใน http() โดยตรงเพื่อความชัวร์
    [ritualchain.id]: http("https://ritual-chain--t2rawanta.replit.app"),
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [base.id]: http(),
    [optimism.id]: http(),
    [arbitrum.id]: http(),
    [polygon.id]: http(),
    [bsc.id]: http(),
  },
  ssr: false,
});