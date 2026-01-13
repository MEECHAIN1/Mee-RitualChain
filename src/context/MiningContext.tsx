import React, { createContext, useContext, useState, useEffect } from "react";

interface MiningContextType {
  isMining: boolean;
  minedAmount: number;
  hashRate: number;
  logs: string[];
  setIsMining: (val: boolean) => void;
  setMinedAmount: (val: number | ((prev: number) => number)) => void;
  setLogs: (val: string[] | ((prev: string[]) => string[])) => void;
}

const MiningContext = createContext<MiningContextType | undefined>(undefined);

export const MiningProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMining, setIsMining] = useState(false);
  const [minedAmount, setMinedAmount] = useState(0);
  const [hashRate, setHashRate] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isMining) {
      interval = setInterval(() => {
        const currentHash = 450 + Math.random() * 100;
        setHashRate(currentHash);
        setMinedAmount(prev => prev + 0.00042);

        if (Math.random() > 0.7) {
          const msgs = [
            "Found share difficulty 1024",
            "Channeling void flux...",
            "Block #88291 accepted",
            "Synthesizing MCB particle...",
            "Ritual resonance stabilized"
          ];
          const msg = msgs[Math.floor(Math.random() * msgs.length)];
          setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 20));
        }
      }, 500);
    } else {
      setHashRate(0);
    }
    return () => clearInterval(interval);
  }, [isMining]);

  return (
    <MiningContext.Provider value={{ 
      isMining, minedAmount, hashRate, logs, 
      setIsMining, setMinedAmount, setLogs 
    }}>
      {children}
    </MiningContext.Provider>
  );
};

export const useMining = () => {
  const context = useContext(MiningContext);
  if (!context) throw new Error("useMining must be used within a MiningProvider");
  return context;
};
