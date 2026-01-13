import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "../utils/TranslationProvider";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import NetworkSwitcher from "./NetworkSwitcher";

const Navbar: React.FC = () => {
  const { t, language, setLanguage } = useTranslation();
  const location = useLocation();
  const { isConnected } = useAccount();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-[100] w-full bg-meebot-surface/90 backdrop-blur-xl border-b border-meebot-border/50 shadow-2xl">
      <div className="container mx-auto px-4 md:px-6 h-20 flex justify-between items-center">
        
        {/* LOGO SECTION */}
        <Link to="/dashboard" className="flex items-center gap-3 group shrink-0">
          <div className="relative h-12 w-12">
            <div className="absolute inset-0 bg-meebot-accent/30 blur-xl rounded-full animate-pulse group-hover:bg-meebot-accent/50 transition-all"></div>
            <img 
              src="/assets/logo.png" 
              alt="MeeChain Logo" 
              className="w-full h-full object-contain relative z-10 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12"
            />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xl md:text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-meebot-accent to-orange-400 tracking-tighter">
              MEECHAIN
            </h1>
            <p className="text-[10px] text-meebot-text-secondary uppercase tracking-[0.2em] font-bold">MeeBot Ecosystem</p>
          </div>
        </Link>

        {/* CENTER NAVIGATION (DESKTOP) */}
        <div className="hidden lg:flex items-center justify-center flex-1 mx-8">
          <ul className="flex gap-1 bg-black/20 p-1.5 rounded-full border border-meebot-border/30 backdrop-blur-md">
            {[
                { path: "/mining", label: "nav.mining", icon: "⛏️" },
                { path: "/dashboard", label: "nav.dashboard", icon: "🔮" },
                { path: "/staking", label: "nav.staking", icon: "⚡" },
                { path: "/gallery", label: "nav.gallery", icon: "🖼️" },
                { path: "/events", label: "nav.events", icon: "📜" }
            ].map((link) => (
                <li key={link.path}>
                    <Link 
                        to={link.path}
                        className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                            isActive(link.path) 
                            ? "bg-meebot-accent text-white shadow-lg shadow-meebot-accent/30 scale-105" 
                            : "text-meebot-text-secondary hover:text-white hover:bg-white/5"
                        }`}
                    >
                        <span className="text-base">{link.icon}</span>
                        {t(link.label)}
                    </Link>
                </li>
            ))}
          </ul>
        </div>

        {/* RIGHT ACTION BUTTONS */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* ระบบสลับ Chain - จัดให้อยู่ในระนาบเดียวกัน */}
          <div className="hidden sm:block">
            <NetworkSwitcher />
          </div>

          {/* Connect Wallet Wrapper */}
          <div className="rainbow-kit-custom relative z-[110]">
            <ConnectButton 
                label={t("wallet.connect")}
                showBalance={false} 
                chainStatus="none" // ปิดสถานะ Chain ของตัวมันเองเพื่อลดการซ้อน
                accountStatus={{
                  smallScreen: 'avatar',
                  largeScreen: 'full',
                }}
            />
          </div>
          
          {/* ปุ่มเปลี่ยนภาษาแบบวงกลมสไตล์ Minimal */}
          <button 
              onClick={() => setLanguage(language === 'en' ? 'th' : 'en')}
              className="w-10 h-10 rounded-xl border border-meebot-border/50 flex items-center justify-center text-lg hover:bg-meebot-accent/10 hover:border-meebot-accent transition-all active:scale-90 bg-meebot-surface shadow-inner"
              title="Switch Language"
          >
              {language === 'en' ? '🇺🇸' : '🇹🇭'}
          </button>
        </div>
      </div>

      {/* MOBILE SCROLL NAVIGATION (ด้านล่าง) */}
      <div className="lg:hidden w-full overflow-x-auto no-scrollbar py-3 border-t border-meebot-border/30 bg-black/40 backdrop-blur-md">
        <div className="flex gap-6 px-6 min-w-max">
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
                    className={`text-[13px] font-bold uppercase tracking-wider transition-all ${
                      isActive(link.path) 
                      ? "text-meebot-accent border-b-2 border-meebot-accent pb-1" 
                      : "text-meebot-text-secondary"
                    }`}
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