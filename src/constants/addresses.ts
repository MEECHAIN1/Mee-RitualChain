// Addresses exported from the deploy script or environment variables
export const CONTRACT_ADDRESSES = {
  // Use import.meta.env if available (Vite), otherwise fallback to hardcoded local addresses
  // You should update these after running npx hardhat run scripts/deploy.ts
  MeeBotNFT: (import.meta as any).env?.VITE_NFT_ADDRESS || "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
  MeeBotStaking: (import.meta as any).env?.VITE_STAKING_ADDRESS || "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
  MeeToken: (import.meta as any).env?.VITE_TOKEN_ADDRESS || "0x82a03a59f55d01c60035dbaef84abc2bcd02560b",
  MeeBotMarketplace: (import.meta as any).env?.VITE_MARKETPLACE_ADDRESS || "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9",
};