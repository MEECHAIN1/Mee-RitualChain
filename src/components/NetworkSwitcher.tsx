import React, { useState, useRef, useEffect } from 'react';
import { useAccount, useChainId, useSwitchChain } from 'wagmi';
import { ritualchain } from '../wagmi';
import { motion, AnimatePresence } from 'framer-motion';

const NetworkSwitcher = () => {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain, chains } = useSwitchChain();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isConnected) return null;

  const currentChain = chains.find(c => c.id === chainId);
  const isRitual = chainId === ritualchain.id;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${
          isRitual 
            ? 'bg-meebot-accent/10 border-meebot-accent text-meebot-accent' 
            : 'bg-meebot-highlight/10 border-meebot-highlight text-meebot-highlight'
        }`}
      >
        <span className={`w-2 h-2 rounded-full animate-pulse ${isRitual ? 'bg-meebot-accent' : 'bg-meebot-highlight'}`}></span>
        <span className="text-xs font-bold truncate max-w-[80px] md:max-w-[120px]">
          {currentChain?.name || 'Wrong Network'}
        </span>
        <svg
          className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m19 9-7 7-7-7" />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute right-0 mt-2 w-48 bg-meebot-surface border border-meebot-accent/30 rounded-xl shadow-xl overflow-hidden z-[100]"
          >
            <div className="p-2 space-y-1">
              {chains.map((chain) => (
                <button
                  key={chain.id}
                  onClick={() => {
                    switchChain({ chainId: chain.id });
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    chainId === chain.id 
                      ? 'bg-meebot-accent text-white' 
                      : 'hover:bg-meebot-accent/10 text-meebot-text-secondary hover:text-white'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full ${chainId === chain.id ? 'bg-white' : 'bg-slate-600'}`}></div>
                  {chain.name}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NetworkSwitcher;
