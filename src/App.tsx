import React from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CelebrationProvider } from "./context/CelebrationContext";
import { TranslationProvider } from "./utils/TranslationProvider";
import RitualFaucet from "./components/RitualFaucet";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import NetworkBanner from "./components/NetworkBanner";
import DebugOverlay from "./components/DebugOverlay";
import DashboardPage from "./pages/DashboardPage";
import GenesisPage from "./pages/GenesisPage";
import StakingPage from "./pages/StakingPage";
import EventLogPage from "./pages/EventLogPage";
import NFTGalleryPage from "./pages/NFTGalleryPage";
import MiningPage from "./pages/MiningPage";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { config } from "./wagmi";
import { AvatarProvider } from "./context/AvatarContext";
import { MiningProvider } from "./context/MiningContext";

const queryClient = new QueryClient();

const App: React.FC = () => {
  const [showSplash, setShowSplash] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return (
      <div className="fixed inset-0 z-[100] bg-meebot-bg flex flex-col items-center justify-center overflow-hidden font-sans">
        <div className="relative">
          <div className="absolute inset-0 bg-meebot-accent/20 blur-[100px] rounded-full animate-pulse"></div>
          <div className="absolute -inset-4 border-2 border-meebot-accent/30 rounded-full animate-[ping_3s_linear_infinite]"></div>
          <div className="absolute -inset-8 border border-meebot-highlight/20 rounded-full animate-[ping_4s_linear_infinite]"></div>
          <div className="relative animate-[bounce_2s_ease-in-out_infinite]">
            <img 
              src="/assets/logo.png" 
              alt="MeeChain Logo" 
              className="w-48 h-48 md:w-64 md:h-64 object-contain drop-shadow-[0_0_30px_rgba(255,137,6,0.5)]"
            />
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <h2 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-meebot-accent to-meebot-highlight animate-pulse tracking-tighter">
            MeeChain
          </h2>
          <div className="mt-4 flex flex-col items-center gap-2">
            <div className="w-48 h-1.5 bg-meebot-surface rounded-full overflow-hidden border border-meebot-border">
              <div className="h-full bg-gradient-to-r from-meebot-accent to-meebot-highlight animate-[loading_2.5s_ease-in-out_forwards]"></div>
            </div>
            <p className="text-meebot-text-secondary text-sm font-mono tracking-widest uppercase opacity-60 animate-pulse">
              Initializing Ritual Protocol...
            </p>
          </div>
        </div>

        <style>{`
          @keyframes loading {
            0% { width: 0%; }
            100% { width: 100%; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <React.StrictMode> 
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>
            <AvatarProvider>
              <MiningProvider>
                <TranslationProvider>
                  <CelebrationProvider>
                    <HashRouter>
                      <div className="min-h-screen bg-meebot-bg text-meebot-text-primary flex flex-col font-sans selection:bg-meebot-accent selection:text-white relative overflow-x-hidden">
                        <NetworkBanner />
                        <Navbar />
                        <main className="w-full flex-grow pb-24 md:pb-8">
                          <Routes>
                            <Route path="/" element={<Navigate to="/mining" replace />} />                        
                            <Route path="/mining" element={<MiningPage />} />
                            <Route path="/dashboard" element={<DashboardPage />} />
                            <Route path="/genesis" element={<GenesisPage />} />
                            <Route path="/staking" element={<StakingPage />} />
                            <Route path="/gallery" element={<NFTGalleryPage />} />
                            <Route path="/events" element={<EventLogPage />} />
                            <Route path="/faucet" element={<RitualFaucet />} />
                          </Routes>
                        </main>
                        <Footer />
                        <DebugOverlay className="fixed bottom-4 right-4 z-[60]" />
                      </div>
                    </HashRouter>
                  </CelebrationProvider>
                </TranslationProvider>
              </MiningProvider>
            </AvatarProvider>
          </RainbowKitProvider> 
        </QueryClientProvider>
      </WagmiProvider>
    </React.StrictMode>
  );
};

export default App;
