import { useState, useEffect } from 'react';

// This file mocks the behavior of Wagmi hooks so the UI and Celebration logic 
// can be demonstrated without a live Web3 provider or wallet.
// เพิ่มเข้าไปในไฟล์ mockWeb3.ts ของคุณ

export const useChainId = () => {
  return 13390; // บังคับให้เป็นเลข 13390 ตามที่แอปต้องการ
};

export const useAccount = () => {
  return { address: "0x71C...9A23", isConnected: true };
};

export const useReadContract = (config: any) => {
  // Simulate reading data
  return { data: BigInt(0), refetch: () => {} }; 
};

export const useWriteContract = () => {
  const [isPending, setIsPending] = useState(false);

  const writeContractAsync = async (config: any) => {
    setIsPending(true);
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        setIsPending(false);
        // Simulate random success rate for demo purposes (mostly success)
        if (Math.random() > 0.1) {
          resolve();
        } else {
          reject(new Error("Transaction reverted"));
        }
      }, 1000); // 1.0s delay to simulate blockchain conf
    });
  };

  return { writeContractAsync, isPending };
};

// Mock event watcher
export const useWatchContractEvent = (config: any) => {
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly simulate an event coming in every 10-15 seconds
      if (Math.random() > 0.5) {
        const eventTypes = ['MeeBotMinted', 'Staked', 'RewardClaimed'];
        const type = eventTypes[Math.floor(Math.random() * eventTypes.length)];
        
        let args = {};
        if (type === 'MeeBotMinted') {
            args = { tokenId: Math.floor(Math.random() * 1000), prompt: 'Cyberpunk Paladin', minter: '0xDiff...User' };
        } else if (type === 'Staked') {
            args = { user: '0xAnother...User', amount: BigInt(500) };
        } else {
            args = { user: '0xWhale...User', reward: BigInt(50) };
        }

        config.onLogs([{ eventName: type, args }]);
      }
    }, 8000);

    return () => clearInterval(interval);
  }, []);
};

export const usePublicClient = () => {
  return {
    getLogs: async (args: any) => {
      return Array(5).fill({});
    }
  };
};
