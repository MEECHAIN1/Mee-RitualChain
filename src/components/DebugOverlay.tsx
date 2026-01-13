import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAccount, useChainId } from "wagmi";
import { CONTRACT_ADDRESSES } from "../constants/addresses";

interface DebugProps {
  file?: File | null;
  events?: any[];
  extra?: Record<string, any>;
  className?: string;
}

const DebugOverlay: React.FC<DebugProps> = ({ file, events, extra, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const chainId = useChainId();
  const { address, isConnected } = useAccount();
  const location = useLocation();
  const [domLoaded, setDomLoaded] = useState(false);

  useEffect(() => { setDomLoaded(true); }, []);

  const positionClass = className || "fixed bottom-4 right-4";

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={`${positionClass} bg-black/90 text-green-400 border border-green-500/50 px-3 py-1.5 rounded-md text-xs font-mono z-[9999] hover:bg-green-900/20 hover:border-green-400 transition-all shadow-[0_0_10px_rgba(34,197,94,0.3)] flex items-center gap-2 animate-pulse`}
      >
        <span>🐞</span> DEBUG
      </button>
    );
  }

  return (
    <div className={`${positionClass} bg-black/95 text-green-400 border border-green-500 rounded-lg z-[9999] font-mono text-[10px] w-72 shadow-[0_0_30px_rgba(34,197,94,0.15)] backdrop-blur-xl animate-slide-in-up overflow-hidden`}>
      {/* Header */}
      <div className="flex justify-between items-center px-3 py-2 border-b border-green-500/30 bg-green-500/10">
        <h3 className="font-bold flex items-center gap-2 text-green-300">
          <span>⚡</span> SYSTEM STATE
        </h3>
        <button
          onClick={() => setIsOpen(false)}
          className="hover:text-white hover:bg-green-500/20 rounded px-1.5 py-0.5 transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Body */}
      <div className="p-3 space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar">
        {/* Network & Route */}
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="opacity-50">Route:</span>
            <span className="text-white bg-green-900/30 px-1 rounded">{location.pathname}</span>
          </div>
          <div className="flex justify-between">
            <span className="opacity-50">Chain ID:</span>
            {/* แก้จาก 1337 เป็น 13390 ให้ตรงกับ RitualChain */}
            <span className={chainId === 13390 ? "text-green-300 font-bold" : "text-red-400 font-bold"}>
              {chainId} {chainId !== 13390 && "(WRONG)"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="opacity-50">Wallet:</span>
            <span className={isConnected ? "text-green-300" : "text-yellow-400 animate-pulse"}>
              {isConnected ? "Connected" : "Disconnected"}
            </span>
          </div>
          {isConnected && (
            <div className="flex justify-between">
              <span className="opacity-50">Address:</span>
              <span className="text-blue-300">{address ? `${address.substring(0, 6)}...${address.slice(-4)}` : "N/A"}</span>
            </div>
          )}
        </div>

        <div className="h-px bg-green-500/30"></div>

        {/* Contracts */}
        <div className="space-y-1">
          <div className="text-[9px] font-bold text-green-600 mb-1 tracking-wider">CONTRACTS</div>
          <div className="flex justify-between items-center">
            <span className="opacity-50">NFT:</span>
            <span className="truncate max-w-[140px] bg-green-900/20 px-1 rounded text-[9px]">
              {CONTRACT_ADDRESSES.MeeBotNFT.slice(0, 10)}...
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="opacity-50">Staking:</span>
            <span className="truncate max-w-[140px] bg-green-900/20 px-1 rounded text-[9px]">
              {CONTRACT_ADDRESSES.MeeBotStaking.slice(0, 10)}...
            </span>
          </div>
        </div>

        {/* Local Page Props (File/Events) */}
        {(file || events || extra) && (
          <>
            <div className="h-px bg-green-500/30"></div>
            <div className="space-y-1">
              <div className="text-[9px] font-bold text-blue-500 mb-1 tracking-wider">LOCAL CONTEXT</div>
              {file !== undefined && (
                <div className="flex justify-between">
                  <span className="opacity-50">File:</span>
                  {file ? (
                    <span className="text-blue-300 truncate max-w-[120px]">{file.name}</span>
                  ) : (
                    <span className="text-gray-500 italic">None</span>
                  )}
                </div>
              )}
              {extra && Object.entries(extra).map(([k, v]) => (
                <div key={k} className="flex justify-between items-start">
                  <span className="opacity-50 mr-2">{k}:</span>
                  <span className="text-white truncate max-w-[120px]">{String(v)}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #22c55e; border-radius: 2px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,20,0,0.3); }
        @keyframes slide-in-up {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-in-up {
          animation: slide-in-up 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  );
};

export default DebugOverlay;