import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "../utils/TranslationProvider";
import { useCelebration } from "../context/CelebrationContext";
import { useAccount, useConnect } from "wagmi";
import { useMining } from "../context/MiningContext";

const MiningPage: React.FC = () => {
  const { t } = useTranslation();
  const { triggerCelebration } = useCelebration();
  const { isConnected } = useAccount();
  const { connectAsync, connectors } = useConnect();
  const { isMining, minedAmount, hashRate, logs, setIsMining, setLogs } = useMining();
  
  const logsRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logs
  useEffect(() => {
    if (logsRef.current) {
        logsRef.current.scrollTop = logsRef.current.scrollHeight;
    }
  }, [logs]);

  const toggleMining = async () => {
      if (!isConnected) {
          triggerCelebration("⚠️ Connect Wallet First!");
          try {
              await connectAsync({ connector: connectors[0] });
          } catch (e) {
              console.error("Connection failed", e);
          }
          return;
      }

      if (!isMining) {
          setIsMining(true);
          triggerCelebration("⛏️ Ritual Started! Mining initiated.");
          setLogs(prev => [`[System] Initializing mining protocol...`, ...prev]);
      } else {
          setIsMining(false);
          setLogs(prev => [`[System] Mining halted.`, ...prev]);
      }
  };

  return (
    <div className="max-w-5xl mx-auto py-4 md:py-8 min-h-[calc(100vh-80px)] flex flex-col justify-center">
        <header className="text-center mb-8 md:mb-12 animate-slide-in-down">
            <h2 className="text-3xl md:text-5xl font-bold text-meebot-text-primary mb-2 md:mb-4 flex justify-center items-center gap-3">
                <span className={isMining ? "animate-spin" : ""}>⛏️</span> {t("mining.title")}
            </h2>
            <p className="text-meebot-text-secondary max-w-lg mx-auto px-4 text-sm md:text-base">
                {t("mining.desc")}
            </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-stretch px-2 md:px-0">
            {/* Left: Control Panel */}
            <div className="bg-meebot-surface border border-meebot-border rounded-2xl p-6 md:p-8 relative overflow-hidden flex flex-col justify-between shadow-2xl">
                <div className="relative z-10">
                    <div className="flex justify-between items-center mb-6">
                        <span className="text-meebot-text-secondary text-sm font-bold uppercase tracking-widest">{t("mining.status")}</span>
                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border ${isMining ? 'bg-green-500/10 text-green-400 border-green-500/30' : 'bg-red-500/10 text-red-400 border-red-500/30'}`}>
                            <span className={`w-2 h-2 rounded-full ${isMining ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></span>
                            {isMining ? t("mining.status.active") : t("mining.status.idle")}
                        </div>
                    </div>

                    <div className="mb-8 text-center py-8 border-2 border-dashed border-meebot-border rounded-xl bg-meebot-bg/30 relative">
                        {/* MeeChain Brand Image */}
                        <div className="flex justify-center mb-4 relative z-10">
                            <div className={`transition-all duration-1000 ${isMining ? 'scale-110 drop-shadow-[0_0_20px_rgba(255,137,6,0.4)]' : 'opacity-80'}`}>
                                <img src="/assets/logo.png" className={`w-24 h-24 object-contain ${isMining ? 'animate-[bounce_2s_ease-in-out_infinite]' : ''}`} alt="MeeChain Miner" />
                            </div>
                        </div>
                        {/* Background Pulse when mining */}
                        {isMining && (
                            <div className="absolute inset-0 bg-meebot-accent/5 animate-pulse rounded-xl"></div>
                        )}
                        <span className="block text-meebot-text-secondary mb-2 text-sm">{t("mining.hashrate")}</span>
                        <span className={`text-4xl font-mono font-bold ${isMining ? 'text-meebot-accent' : 'text-meebot-text-secondary'}`}>
                            {hashRate.toFixed(2)} <span className="text-lg">MH/s</span>
                        </span>
                    </div>

                    <div className="flex justify-between items-end mb-2">
                         <span className="text-meebot-text-secondary text-sm">{t("mining.mined")}</span>
                    </div>
                    <div className="bg-black/40 p-4 rounded-lg border border-meebot-border font-mono text-2xl text-white mb-8 flex justify-between items-center">
                        <span>{minedAmount.toFixed(6)}</span>
                        <span className="text-sm text-meebot-accent font-bold">MCB</span>
                    </div>
                </div>

                <button
                    onClick={toggleMining}
                    className={`relative z-10 w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 transform active:scale-95 shadow-lg flex items-center justify-center gap-2 mb-4 ${
                        isMining 
                        ? "bg-red-500 hover:bg-red-600 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]" 
                        : "bg-meebot-accent hover:bg-meebot-highlight text-white shadow-[0_0_20px_rgba(255,137,6,0.4)]"
                    }`}
                >
                    {isMining ? (
                        <>🛑 {t("mining.stop")}</>
                    ) : (
                        <>⚡ {t("mining.start")}</>
                    )}
                </button>

                <button
                    disabled={minedAmount <= 0}
                    className={`relative z-10 w-full py-3 rounded-xl font-bold text-lg transition-all duration-300 transform active:scale-95 shadow-lg flex items-center justify-center gap-2 ${
                        minedAmount > 0
                        ? "bg-green-500 hover:bg-green-600 text-white shadow-[0_0_20px_rgba(34,197,94,0.4)]" 
                        : "bg-gray-700 text-gray-400 cursor-not-allowed"
                    }`}
                    onClick={() => {
                        if (minedAmount > 0) {
                            alert(`Claimed ${minedAmount.toFixed(6)} MCB!`);
                        }
                    }}
                >
                    💰 {t("mining.claim") || "Claim Tokens"}
                </button>
            </div>

            {/* Right: Terminal Log & Visual */}
            <div className="bg-black border border-meebot-border rounded-2xl p-6 font-mono text-xs md:text-sm text-green-400 flex flex-col h-[500px] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-8 bg-meebot-surface border-b border-meebot-border flex items-center px-4 gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="ml-2 text-meebot-text-secondary opacity-50">ritual_miner_v1.exe</span>
                </div>
                
                <div className="mt-8 flex-1 overflow-y-auto custom-scrollbar space-y-1 opacity-90" ref={logsRef}>
                    <div className="text-meebot-text-secondary opacity-50 mb-4">
                        {">"} Connecting to node: wss://ritual-chain.rpc... OK<br/>
                        {">"} Loading ancient scriptures... OK<br/>
                        {">"} Calibrating spectral sensors... OK<br/>
                        {">"} Ready to channel.
                    </div>
                    {logs.map((log, i) => (
                        <div key={i} className="animate-fade-in">
                            <span className="text-green-600">{">"}</span> {log}
                        </div>
                    ))}
                    {isMining && (
                        <div className="animate-pulse">_</div>
                    )}
                </div>

                {/* Cyber Circle Animation */}
                <div className="absolute bottom-4 right-4 w-24 h-24 pointer-events-none opacity-20">
                     <div className={`w-full h-full border-4 border-t-green-500 border-r-green-500/50 border-b-transparent border-l-transparent rounded-full ${isMining ? 'animate-spin' : ''}`}></div>
                </div>
            </div>
        </div>
     </div>
  );
};

export default MiningPage;
