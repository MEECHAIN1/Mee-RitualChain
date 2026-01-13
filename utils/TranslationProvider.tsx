import React, { createContext, useContext, useState } from "react";
import { Language, TranslationContextType } from "../types";

const translations: Record<Language, Record<string, string>> = {
  en: {
    "nav.dashboard": "Dashboard",
    "nav.genesis": "Genesis Ritual",
    "nav.staking": "Staking Altar",
    "nav.events": "Oracle Logs",
    "genesis.title": "Summon a MeeBot",
    "genesis.desc": "Enter a mystical theme to bring your digital familiar to life.",
    "genesis.placeholder": "e.g., Cyberpunk Monk, Neon Druid...",
    "genesis.button": "Mint MeeBot",
    "staking.title": "Energy Staking",
    "staking.desc": "Lock your MCB tokens to channel energy and earn rewards.",
    "staking.balance": "Staked Balance",
    "staking.rewards": "Earned Rewards",
    "staking.claim": "Claim Rewards",
    "staking.stake": "Stake Tokens",
    "staking.unstake": "Unstake Tokens",
    "events.title": "Real-time Ritual Event Logs",
    "footer.text": "RitualChain © 2025 — Crafted with 🪄⚡🎉",
    "celebration.mint.success": "MeeBot minted successfully!",
    "celebration.mint.fail": "Mint failed. The ritual was interrupted.",
    "celebration.stake.success": "MCB staked successfully!",
    "celebration.stake.fail": "Staking failed.",
    "celebration.unstake.success": "Unstake successful!",
    "celebration.unstake.fail": "Unstake failed.",
    "celebration.claim.success": "MCB Rewards claimed successfully!",
    "celebration.claim.fail": "Claim failed.",
    "dash.welcome": "Welcome, Initiate.",
    "dash.stats": "Network Statistics"
  },
  th: {
    "nav.dashboard": "แดชบอร์ด",
    "nav.genesis": "พิธีกรรมกำเนิด",
    "nav.staking": "แท่นบูชาฝากเหรียญ",
    "nav.events": "บันทึกเทพพยากรณ์",
    "genesis.title": "อัญเชิญ MeeBot",
    "genesis.desc": "ใส่ธีมที่ต้องการเพื่อปลุกชีพผู้ช่วยดิจิทัลของคุณ",
    "genesis.placeholder": "เช่น นักบวชไซเบอร์, ดรูอิดแสงนีออน...",
    "genesis.button": "สร้าง MeeBot",
    "staking.title": "ฝากพลังงาน",
    "staking.desc": "ล็อคเหรียญ MCB ของคุณเพื่อรวบรวมพลังงานและรับรางวัล",
    "staking.balance": "ยอดที่ฝากไว้",
    "staking.rewards": "รางวัลที่ได้รับ",
    "staking.claim": "รับรางวัล",
    "staking.stake": "ฝากเหรียญ",
    "staking.unstake": "ถอนเหรียญ",
    "events.title": "บันทึกเหตุการณ์พิธีกรรมแบบเรียลไทม์",
    "footer.text": "RitualChain © 2025 — สร้างสรรค์ด้วยเวทมนตร์ 🪄⚡🎉",
    "celebration.mint.success": "การสร้าง MeeBot สำเร็จ!",
    "celebration.mint.fail": "การสร้าง MeeBot ล้มเหลว พิธีกรรมถูกขัดจังหวะ",
    "celebration.stake.success": "การฝากเหรียญ MCB สำเร็จ!",
    "celebration.stake.fail": "การฝากเหรียญล้มเหลว",
    "celebration.unstake.success": "การถอนเหรียญ MCB สำเร็จ!",
    "celebration.unstake.fail": "การถอนเหรียญล้มเหลว",
    "celebration.claim.success": "รับรางวัล MCB เรียบร้อย!",
    "celebration.claim.fail": "การรับรางวัลล้มเหลว",
    "dash.welcome": "ยินดีต้อนรับ ผู้ศรัทธาใหม่",
    "dash.stats": "สถิติเครือข่าย"
  },
};

const TranslationContext = createContext<TranslationContextType | null>(null);

export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <TranslationContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const ctx = useContext(TranslationContext);
  if (!ctx) throw new Error("useTranslation must be used within TranslationProvider");
  return ctx;
};