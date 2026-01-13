import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

// Simple internal Confetti implementation to avoid dependency issues in preview environments
const SimpleConfetti: React.FC = () => {
  const colors = ['#ff8906', '#f25f4c', '#fffffe', '#a7a9be', '#e53170'];
  
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-40">
      {Array.from({ length: 50 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 rounded-sm opacity-0 animate-confetti"
          style={{
            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
            left: `${Math.random() * 100}%`,
            top: `-5%`,
            animation: `fall ${Math.random() * 3 + 2}s linear forwards`,
            animationDelay: `${Math.random() * 0.5}s`
          }}
        />
      ))}
      <style>{`
        @keyframes fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

type CelebrationContextType = {
  triggerCelebration: (message: string) => void;
};

const CelebrationContext = createContext<CelebrationContextType | null>(null);

export const CelebrationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [message, setMessage] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const triggerCelebration = useCallback((msg: string) => {
    setMessage(msg);
    setShowConfetti(true);
    
    // Hide toast after 4s
    const toastTimeout = setTimeout(() => setMessage(null), 4000);
    // Stop generating confetti after 4s
    const confettiTimeout = setTimeout(() => setShowConfetti(false), 4000);

    return () => {
      clearTimeout(toastTimeout);
      clearTimeout(confettiTimeout);
    };
  }, []);

  return (
    <CelebrationContext.Provider value={{ triggerCelebration }}>
      {children}
      {showConfetti && <SimpleConfetti />}
      {message && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-bounce">
          <div className="bg-meebot-surface border border-meebot-accent/50 text-meebot-text-primary px-8 py-4 rounded-xl shadow-[0_0_20px_rgba(255,137,6,0.3)] flex items-center gap-3 backdrop-blur-md">
            <span className="text-2xl">🎉</span>
            <span className="font-bold text-lg tracking-wide">{message}</span>
          </div>
        </div>
      )}
    </CelebrationContext.Provider>
  );
};

export const useCelebration = () => {
  const ctx = useContext(CelebrationContext);
  if (!ctx) throw new Error("useCelebration must be used within CelebrationProvider");
  return ctx;
};
