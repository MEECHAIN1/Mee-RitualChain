import React, { useState, useEffect, useRef } from "react";
import { useWatchContractEvent } from "wagmi";
import { formatUnits } from "viem";
import { MeeBotNFTAbi } from "../abi/MeeBotNFT";
import { MeeBotStakingAbi } from "../abi/MeeBotStaking";
import { CONTRACT_ADDRESSES } from "../constants/addresses";
import { useCelebration } from "../context/CelebrationContext";

interface LogEntry {
  id: string;
  timestamp: string;
  event: string;
  icon: string;
  args: any;
  hash: string;
}

const EventLogPage: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const logEndRef = useRef<HTMLDivElement>(null);
  const { triggerCelebration } = useCelebration();

  // Helper to add log and trigger scroll
  const addLog = (event: string, icon: string, args: any) => {
    const newLog: LogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      event,
      icon,
      args,
      hash: "0x" + Math.random().toString(16).substr(2, 40)
    };

    setLogs((prev) => [...prev.slice(-99), newLog]); // Keep last 100 logs
    
    // Trigger celebration for major events only
    if (['MeeBotMinted', 'RewardClaimed'].includes(event)) {
        triggerCelebration(`${icon} New ${event} Detected!`);
    }
  };

  // Auto-scroll effect
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  // 1. Watch NFT Transfers (Standard ERC721)
  useWatchContractEvent({
    address: CONTRACT_ADDRESSES.MeeBotNFT as `0x${string}`,
    abi: MeeBotNFTAbi,
    eventName: "Transfer",
    onLogs(events: any[]) {
      events.forEach(e => {
        if(!e.args) return;
        addLog("Transfer", "⚡", {
           from: e.args.from,
           to: e.args.to,
           tokenId: e.args.tokenId?.toString()
        });
      });
    },
  });

  // 2. Watch NFT Approvals (Standard ERC721)
  useWatchContractEvent({
    address: CONTRACT_ADDRESSES.MeeBotNFT as `0x${string}`,
    abi: MeeBotNFTAbi,
    eventName: "Approval",
    onLogs(events: any[]) {
      events.forEach(e => {
        if(!e.args) return;
        addLog("Approval", "🔐", {
           owner: e.args.owner,
           approved: e.args.approved,
           tokenId: e.args.tokenId?.toString()
        });
      });
    },
  });

  // 3. Watch Custom Mint Event
  useWatchContractEvent({
    address: CONTRACT_ADDRESSES.MeeBotNFT as `0x${string}`,
    abi: MeeBotNFTAbi,
    eventName: "MeeBotMinted",
    onLogs(events: any[]) {
      events.forEach(e => {
        if(!e.args) return;
        addLog("MeeBotMinted", "🪄", {
           minter: e.args.minter,
           tokenId: e.args.tokenId?.toString(),
           prompt: e.args.prompt
        });
      });
    },
  });

  // 4. Watch Staking Events
  useWatchContractEvent({
    address: CONTRACT_ADDRESSES.MeeBotStaking as `0x${string}`,
    abi: MeeBotStakingAbi,
    eventName: "Staked",
    onLogs(events: any[]) {
      events.forEach(e => {
        if(!e.args) return;
        addLog("Staked", "🥩", {
           user: e.args.user,
           amount: formatUnits(e.args.amount || 0n, 18) + " MCB"
        });
      });
    },
  });

  useWatchContractEvent({
    address: CONTRACT_ADDRESSES.MeeBotStaking as `0x${string}`,
    abi: MeeBotStakingAbi,
    eventName: "RewardClaimed",
    onLogs(events: any[]) {
      events.forEach(e => {
        if(!e.args) return;
        addLog("RewardClaimed", "💎", {
           user: e.args.user,
           reward: formatUnits(e.args.reward || 0n, 18) + " MCB"
        });
      });
    },
  });

  return (
    <div className="max-w-6xl mx-auto py-8 h-[80vh] flex flex-col">
      <div className="flex justify-between items-center mb-4 px-2">
        <h1 className="text-2xl font-bold text-meebot-text-primary flex items-center gap-2">
          <span>✨</span> Event Log Ritual
        </h1>
        <div className="flex items-center gap-2 text-xs font-mono">
            <span className="animate-pulse text-green-400">● LIVE</span>
            <span className="text-meebot-text-secondary">{logs.length} events captured</span>
        </div>
      </div>

      {/* Terminal Window */}
      <div className="flex-1 bg-black/90 border border-meebot-border rounded-xl p-4 overflow-hidden flex flex-col shadow-2xl relative font-mono text-sm backdrop-blur-sm">
        
        {/* Terminal Header */}
        <div className="absolute top-0 left-0 right-0 h-8 bg-meebot-surface/50 border-b border-meebot-border flex items-center px-4 gap-2 z-10">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            <div className="ml-4 text-xs text-meebot-text-secondary opacity-50">ritual_oracle_v1.0.sh</div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto pt-10 pb-4 space-y-1 custom-scrollbar">
            {logs.length === 0 && (
                <div className="text-meebot-text-secondary opacity-50 italic">
                    {">"} Waiting for blockchain signals...
                </div>
            )}
            
            {logs.map((log) => (
                <div key={log.id} className="hover:bg-white/5 p-1 rounded transition-colors group">
                    <div className="flex items-start gap-3 break-all">
                        <span className="text-gray-500 min-w-[80px] select-none">[{log.timestamp}]</span>
                        <span className="text-green-400 font-bold min-w-[140px] flex items-center gap-2">
                            {log.icon} {log.event}
                        </span>
                        <span className="text-meebot-text-secondary group-hover:text-white transition-colors">
                            {/* Pretty print args nicely inline */}
                            {Object.entries(log.args).map(([key, value], i) => (
                                <span key={key} className="mr-3">
                                    <span className="text-gray-500">{key}:</span>
                                    <span className="text-meebot-accent ml-1">
                                        {typeof value === 'string' && value.startsWith('0x') 
                                            ? `${value.substring(0,6)}...${value.substring(value.length-4)}` 
                                            : String(value)}
                                    </span>
                                </span>
                            ))}
                        </span>
                        <span className="ml-auto text-xs text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity select-none">
                            tx: {log.hash.substring(0,8)}...
                        </span>
                    </div>
                </div>
            ))}
            <div ref={logEndRef} />
            
            {/* Blinking Cursor */}
            <div className="mt-2 text-green-500 animate-pulse">_</div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: #000;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #22c55e;
            border-radius: 4px;
            border: 2px solid #000;
        }
      `}</style>
    </div>
  );
};

export default EventLogPage;