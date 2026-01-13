import React, { useEffect, useState, useRef } from "react";
import { getMeeBotImageUrl, getGatewayUrl } from "../utils/ipfs";
import { useTranslation } from "../utils/TranslationProvider";
import { usePublicClient } from "wagmi";
import { CONTRACT_ADDRESSES } from "../constants/addresses";
import { MeeBotNFTAbi } from "../abi/MeeBotNFT";

const NFTGalleryPage: React.FC = () => {
  const { t } = useTranslation();
  const client = usePublicClient();
  const [meeBots, setMeeBots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalMinted, setTotalMinted] = useState(0);
  
  // Audio Refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const [isAudioActive, setIsAudioActive] = useState(false);

  const fetchNFTs = async () => {
    if (!client) return;
    try {
        setLoading(true);
        
        // Find the event definition in the ABI safely
        const mintEvent = MeeBotNFTAbi.find(
            (x) => x.type === 'event' && x.name === 'MeeBotMinted'
        );

        if (!mintEvent) {
            console.error("MeeBotMinted event not found in ABI");
            setLoading(false);
            return;
        }

        // Fetch logs to find minted NFTs
        const logs = await client.getLogs({
            address: CONTRACT_ADDRESSES.MeeBotNFT as `0x${string}`,
            event: { 
                type: 'event', 
                name: 'MeeBotMinted', 
                inputs: mintEvent.inputs 
            } as any,
            fromBlock: 'earliest',
        });

        setTotalMinted(logs?.length || 0);

        if (!logs || logs.length === 0) {
            setMeeBots([]);
            setLoading(false);
            return;
        }

        const bots = await Promise.all(logs.map(async (log: any) => {
            // Check for log existence, args existence, and tokenId existence
            if (!log || !log.args || log.args.tokenId == null) return null;
            
            try {
                const tokenId = log.args.tokenId.toString();
                const rawUri = log.args.prompt || "";
                
                let botData = {
                    id: tokenId,
                    name: `MeeBot #${tokenId}`,
                    description: rawUri,
                    image: ""
                };

                // Check if URI is an IPFS link to metadata
                if (rawUri && rawUri.startsWith("ipfs://")) {
                    try {
                        const metadataUrl = getGatewayUrl(rawUri);
                        const res = await fetch(metadataUrl);
                        if (res.ok) {
                            try {
                                const metadata = await res.json();
                                botData.name = metadata.name || botData.name;
                                if (metadata.description) botData.description = metadata.description;
                                if (metadata.image) {
                                    botData.image = getMeeBotImageUrl(metadata.image);
                                }
                            } catch {
                                // If not JSON, assume the URI points directly to the image
                                botData.image = getMeeBotImageUrl(rawUri);
                            }
                        } else {
                            throw new Error("Metadata fetch failed");
                        }
                    } catch (e) {
                        console.warn(`Failed to resolve metadata for Token ${tokenId}`, e);
                        // Explicit fallback to prevent empty image
                        botData.image = `https://placehold.co/400x400/23212d/f25f4c?text=MeeBot+%23${tokenId}`;
                    }
                } else if (rawUri) {
                    // Fallback for text prompts
                    botData.image = `https://placehold.co/400x400/23212d/f25f4c?text=${encodeURIComponent(rawUri.substring(0, 10))}`;
                }

                // Final safety check
                if (!botData.image) {
                    botData.image = `https://placehold.co/400x400/23212d/f25f4c?text=MeeBot+%23${tokenId}`;
                }

                return botData;
            } catch (err) {
                console.error("Error parsing gallery log", err);
                return null;
            }
        }));

        const validBots = bots.filter(b => b !== null).reverse(); // Show newest first
        setMeeBots(validBots);

    } catch (e) {
        console.error("Failed to fetch gallery", e);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchNFTs();
  }, [client]);

  // Cleanup Audio on Unmount
  useEffect(() => {
    return () => {
        if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
            audioCtxRef.current.close().catch(e => console.warn(e));
        }
    };
  }, []);

  // Pulse Effect for Audio
  useEffect(() => {
    if (!isAudioActive || !audioCtxRef.current || !gainRef.current) return;
    
    // Mystical Pulse Loop
    const pulseInterval = setInterval(() => {
        if (!audioCtxRef.current || !gainRef.current) return;
        if (audioCtxRef.current.state === 'suspended') return;
        
        const ctx = audioCtxRef.current;
        const t = ctx.currentTime;
        
        // Pulse Oscillator
        const osc = ctx.createOscillator();
        const pulseGain = ctx.createGain();
        
        // Frequency ramp up (mystical rise)
        osc.type = "sine";
        osc.frequency.setValueAtTime(110, t);
        osc.frequency.linearRampToValueAtTime(220, t + 2); 
        
        // Volume Fade In/Out
        pulseGain.gain.setValueAtTime(0, t);
        pulseGain.gain.linearRampToValueAtTime(0.05, t + 1);
        pulseGain.gain.exponentialRampToValueAtTime(0.001, t + 4);
        
        osc.connect(pulseGain);
        pulseGain.connect(gainRef.current); // Connect to master gain
        
        osc.start(t);
        osc.stop(t + 4);

    }, 5000); // Trigger every 5 seconds

    return () => clearInterval(pulseInterval);
  }, [isAudioActive]);

  const toggleSound = () => {
      if (!audioCtxRef.current) {
          // Initialize Audio Context
          const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
          if (!AudioContext) return;
          const ctx = new AudioContext();
          audioCtxRef.current = ctx;

          // Master Gain for Fade In/Out
          const masterGain = ctx.createGain();
          masterGain.gain.setValueAtTime(0, ctx.currentTime);
          masterGain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 2); // Slow fade in
          masterGain.connect(ctx.destination);
          gainRef.current = masterGain;

          // Oscillator 1: Deep Drone (Sine)
          const osc1 = ctx.createOscillator();
          osc1.type = "sine";
          osc1.frequency.value = 110; // A2
          osc1.start();

          // Oscillator 2: Detuned Drone (Triangle for texture)
          const osc2 = ctx.createOscillator();
          osc2.type = "triangle";
          osc2.frequency.value = 111.5; // Slight detune causes mystical beating effect
          osc2.start();

          // Lowpass Filter for "Underwater/Mystical" feel
          const filter = ctx.createBiquadFilter();
          filter.type = "lowpass";
          filter.frequency.value = 400;

          // Connections
          osc1.connect(filter);
          osc2.connect(filter);
          filter.connect(masterGain);

          setIsAudioActive(true);
      } else {
          // Toggle State
          if (audioCtxRef.current.state === 'suspended') {
              audioCtxRef.current.resume();
              if (gainRef.current) {
                  gainRef.current.gain.linearRampToValueAtTime(0.15, audioCtxRef.current.currentTime + 1);
              }
              setIsAudioActive(true);
          } else {
              // Fade out before suspending
              if (gainRef.current) {
                   gainRef.current.gain.cancelScheduledValues(audioCtxRef.current.currentTime);
                   gainRef.current.gain.linearRampToValueAtTime(0, audioCtxRef.current.currentTime + 0.5);
              }
              setTimeout(() => {
                  audioCtxRef.current?.suspend();
                  setIsAudioActive(false);
              }, 500);
          }
      }
  };

  return (
    <div className="space-y-8 animate-float">
      <header className="flex flex-col md:flex-row justify-between items-center py-6 border-b border-meebot-border/50">
        <div>
            <h2 className="text-3xl font-bold text-meebot-text-primary flex items-center gap-2">
                <span>🪄</span> {t("gallery.title")}
            </h2>
            <div className="flex items-center gap-3 mt-2">
                <p className="text-meebot-text-secondary">{t("gallery.subtitle")}</p>
                <span className="text-xs bg-meebot-accent/10 text-meebot-accent px-2 py-1 rounded-full border border-meebot-accent/20">
                    {totalMinted} Summoned
                </span>
            </div>
        </div>
        
        <div className="flex gap-3 mt-4 md:mt-0">
            <button 
                onClick={fetchNFTs}
                className="px-4 py-2 rounded-full border border-meebot-border text-meebot-text-secondary hover:text-white hover:bg-meebot-surface transition-all active:scale-95"
            >
                🔄 Refresh
            </button>
            <button 
                onClick={toggleSound}
                className={`flex items-center gap-3 px-5 py-2 rounded-full border transition-all duration-300 ${
                    isAudioActive 
                    ? "bg-meebot-accent/20 border-meebot-accent text-meebot-accent shadow-[0_0_15px_rgba(255,137,6,0.3)] animate-pulse-slow" 
                    : "bg-meebot-surface border-meebot-border text-meebot-text-secondary hover:text-white hover:border-meebot-text-secondary"
                }`}
            >
                <span className={isAudioActive ? "animate-pulse" : ""}>{isAudioActive ? "🔊" : "🔇"}</span>
                <span className="font-medium text-sm hidden sm:inline">{isAudioActive ? "Ritual Sound Active" : "Enable Sound"}</span>
            </button>
        </div>
      </header>

      {/* Grid Layout */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="bg-meebot-surface border border-meebot-border rounded-xl aspect-[3/4] animate-pulse relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 translate-x-[-100%] animate-[shimmer_2s_infinite]"></div>
                </div>
            ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {meeBots.map((bot) => (
            <div key={bot.id} className="group bg-meebot-surface border border-meebot-border rounded-xl overflow-hidden hover:shadow-[0_0_25px_rgba(242,95,76,0.25)] hover:border-meebot-highlight/50 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02]">
                <div className="relative aspect-square bg-meebot-bg overflow-hidden">
                    {/* Watermark */}
                    <div className="absolute top-3 right-3 z-20 pointer-events-none">
                        <span className="bg-black/60 backdrop-blur-md border border-white/20 text-white/90 text-[10px] font-bold px-2 py-1 rounded tracking-widest shadow-lg">
                            MEECHAIN NFTs
                        </span>
                    </div>

                    <img
                    src={bot.image}
                    alt={bot.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => { (e.target as HTMLImageElement).src = `https://placehold.co/400x400/23212d/f25f4c?text=MeeBot+%23${bot.id}`; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 z-10">
                        <span className="text-meebot-highlight font-bold tracking-wider text-sm uppercase">MeeBot</span>
                        <span className="text-white font-bold text-lg leading-tight">{bot.name}</span>
                    </div>
                </div>
                <div className="p-4 relative">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs bg-meebot-bg px-2 py-1 rounded text-meebot-text-secondary border border-meebot-border font-mono">#{bot.id}</span>
                        <span className="text-xs text-meebot-accent/80 font-medium">RitualChain</span>
                    </div>
                    <p className="text-sm text-meebot-text-secondary truncate">{bot.description || "No description provided."}</p>
                    
                    {/* Hover Glow Effect */}
                    <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-meebot-highlight/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                </div>
            </div>
            ))}
        </div>
      )}
      
      {!loading && meeBots.length === 0 && (
          <div className="text-center py-20 text-meebot-text-secondary opacity-60 border-2 border-dashed border-meebot-border rounded-xl">
              <p className="text-4xl mb-4">🔮</p>
              <p className="text-lg">The void is empty.</p>
              <p className="text-sm">Summon a MeeBot to begin the collection.</p>
          </div>
      )}
      <style>{`
        @keyframes shimmer {
            100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default NFTGalleryPage;