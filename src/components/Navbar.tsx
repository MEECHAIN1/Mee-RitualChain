import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "../utils/TranslationProvider";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useDisconnect } from "wagmi";
import { useCelebration } from "../context/CelebrationContext";

import { useAvatar } from "../context/AvatarContext";
import NetworkSwitcher from "./NetworkSwitcher";

const Navbar: React.FC = () => {
  const { t, language, setLanguage } = useTranslation();
  const location = useLocation();
  const { address, isConnected } = useAccount();
  const { triggerCelebration } = useCelebration();
  const { avatar } = useAvatar();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-meebot-surface/80 backdrop-blur-lg border-b border-meebot-border shadow-lg">
      <div className="container mx-auto px-4 md:px-6 py-4 flex justify-between items-center gap-4">
        <Link to="/dashboard" className="flex items-center gap-2 group shrink-0">
          {/* Avatar Preview in Navbar */}
          <div 
            className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-meebot-accent relative flex items-center justify-center overflow-hidden transition-transform group-hover:scale-110 shadow-lg"
            style={{ backgroundColor: avatar.skinColor }}
          >
             <span className="text-base md:text-lg">
               {avatar.expression === 'smile' && '😊'}
               {avatar.expression === 'neutral' && '😐'}
               {avatar.expression === 'surprised' && '😲'}
               {avatar.expression === 'cool' && '😎'}
               {avatar.expression === 'happy' && '😁'}
             </span>
             {avatar.accessory !== 'none' && (
               <div className="absolute top-0.5 right-0.5 text-[6px] md:text-[8px]">
                  {avatar.accessory === 'glasses' && '👓'}
                  {avatar.accessory === 'hat' && '🎩'}
                  {avatar.accessory === 'necklace' && '📿'}
                  {avatar.accessory === 'earrings' && '✨'}
               </div>
             )}
          </div>
          <h1 className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-meebot-text-primary to-meebot-accent">
            RitualChain
          </h1>
        </Link>
        
        <div className="flex items-center gap-2 md:gap-4 ml-auto">
          <ul className="hidden lg:flex gap-1 bg-meebot-bg/50 p-1 rounded-full border border-meebot-border">
            {[
                { path: "/mining", label: "nav.mining", icon: "⛏️" },
                { path: "/dashboard", label: "nav.dashboard", icon: "🔮" },
                { path: "/genesis", label: "nav.genesis", icon: "" },
                { path: "/staking", label: "nav.staking", icon: "⚡" },
                { path: "/gallery", label: "nav.gallery", icon: "🖼️" },
                { path: "/events", label: "nav.events", icon: "📜" }
            ].map((link) => (
                <li key={link.path}>
                    <Link 
                        to={link.path}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                            isActive(link.path) 
                            ? "bg-meebot-accent text-white shadow-[0_0_10px_rgba(255,137,6,0.4)]" 
                            : "text-meebot-text-secondary hover:text-white hover:bg-meebot-surface"
                        }`}
                    >
                        <span>{link.icon}</span>
                        {t(link.label)}
                    </Link>
                </li>
            ))}
          </ul>

          <div className="flex items-center gap-1 md:gap-2">
            <div className="flex items-center">
              <NetworkSwitcher />
            </div>
            <div className="rainbow-kit-button relative z-[60] scale-90 md:scale-100 origin-right">
              <ConnectButton 
                label={t("wallet.connect")}
                showBalance={false} 
                chainStatus="none"
                accountStatus="address"
              />
            </div>
            
            <button 
                onClick={() => setLanguage(language === 'en' ? 'th' : 'en')}
                className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-meebot-border flex items-center justify-center text-meebot-text-secondary hover:text-white hover:border-meebot-accent transition-colors relative z-[60] bg-meebot-surface"
            >
                {language === 'en' ? '🇺🇸' : '🇹🇭'}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Menu - Improved with horizontal scroll or better wrapping */}
      <div className="lg:hidden flex overflow-x-auto no-scrollbar py-2 border-t border-meebot-border/50 bg-meebot-surface/50">
        <div className="flex gap-4 px-4 min-w-max">
             {[
                { path: "/mining", label: t("nav.mining") },
                { path: "/dashboard", label: t("nav.dashboard") },
                { path: "/genesis", label: t("nav.genesis") },
                { path: "/staking", label: t("nav.staking") },
                { path: "/gallery", label: t("nav.gallery") },
                { path: "/events", label: t("nav.events") }
            ].map((link) => (
                <Link 
                    key={link.path}
                    to={link.path} 
                    className={`text-sm font-medium whitespace-nowrap py-1 ${isActive(link.path) ? "text-meebot-accent border-b-2 border-meebot-accent" : "text-meebot-text-secondary"}`}
                >
                    {link.label}
                </Link>
            ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;