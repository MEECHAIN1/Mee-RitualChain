import React from "react";
import { useAccount, useChainId, useSwitchChain } from "wagmi";
import { ritualchain } from "../wagmi";
import { useCelebration } from "../context/CelebrationContext";
import { useTranslation } from "../utils/TranslationProvider";

const NetworkBanner: React.FC = () => {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain, isPending, chains } = useSwitchChain();
  const { triggerCelebration } = useCelebration();
  const { t } = useTranslation();

  if (!isConnected) return null;

  const isSupported = chains.some(c => c.id === chainId);
  if (isSupported && chainId === ritualchain.id) {
    return null;
  }

  const handleSwitch = async () => {
    try {
        await switchChain({ chainId: ritualchain.id });
        triggerCelebration(t("banner.connected"));
    } catch (e) {
        console.error("Failed to switch chain", e);
    }
  };

  const currentChainName = chains.find(c => c.id === chainId)?.name || "Unsupported Network";

  return (
    <div className="bg-gradient-to-r from-meebot-accent/90 via-meebot-surface to-meebot-accent/90 border-b border-meebot-accent/50 backdrop-blur-xl relative z-50 shadow-[0_5px_20px_rgba(255,137,6,0.2)] animate-slide-down">
      <div className="container mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-center md:justify-between gap-4">
        
        <div className="flex items-center gap-4">
            <div className="relative">
                <div className="absolute inset-0 bg-meebot-accent blur-lg opacity-40 animate-pulse"></div>
                <div className="relative w-10 h-10 rounded-full bg-meebot-bg border border-meebot-accent flex items-center justify-center text-xl shadow-inner">
                    🌐
                </div>
            </div>
            <div className="text-center md:text-left">
                <h3 className="font-bold text-white tracking-wide flex items-center justify-center md:justify-start gap-2">
                    {chainId === ritualchain.id ? "Connected to RitualChain" : `Connected to ${currentChainName}`}
                </h3>
                <p className="text-meebot-text-secondary text-sm">
                    {chainId === ritualchain.id ? t("banner.ready") : t("banner.wrong_desc")}
                </p>
            </div>
        </div>

        {chainId !== ritualchain.id && (
          <button
            onClick={handleSwitch}
            disabled={isPending}
            className="group relative px-6 py-2 bg-gradient-to-r from-meebot-accent to-meebot-highlight hover:from-meebot-highlight hover:to-meebot-accent text-white rounded-lg font-bold transition-all duration-300 shadow-[0_0_15px_rgba(255,137,6,0.4)] hover:shadow-[0_0_25px_rgba(255,137,6,0.6)] hover:-translate-y-0.5 active:translate-y-0 overflow-hidden border border-meebot-accent/20"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            <span className="relative flex items-center gap-2">
              {isPending ? (
                  <>
                      <span className="animate-spin">⚡</span> {t("banner.switching")}
                  </>
              ) : (
                  <>
                       {t("banner.switch")}
                  </>
              )}
            </span>
          </button>
        )}
      </div>
      <style>{`
        @keyframes slide-down {
            from { transform: translateY(-100%); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-down {
            animation: slide-down 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default NetworkBanner;
