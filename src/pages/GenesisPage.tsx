import React, { useState, useRef, useEffect } from "react";
import { useWriteContract } from "wagmi";
import { MeeBotNFTAbi } from "../abi/MeeBotNFT";
import { CONTRACT_ADDRESSES } from "../constants/addresses";
import { useCelebration } from "../context/CelebrationContext";
import { useTranslation } from "../utils/TranslationProvider";
import { uploadToIPFS, uploadJSONToIPFS } from "../utils/ipfs";
import { playMintSound } from "../utils/sounds";
import DebugOverlay from "../components/DebugOverlay"; // Import Local Debugger

const GenesisPage: React.FC = () => {
  const { triggerCelebration } = useCelebration();
  const { writeContractAsync, isPending } = useWriteContract();
  const [prompt, setPrompt] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [mintedBot, setMintedBot] = useState<{name: string, image: string, desc: string} | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();

  // Cleanup preview URL to avoid memory leaks
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleMint = async () => {
    if (!prompt) return;
    
    // Clear previous result and start loading
    setMintedBot(null);
    setIsUploading(true);

    try {
      let tokenUri = prompt;
      let finalImageUrl = "";

      // Only perform IPFS flow if a file is selected
      if (file) {
        triggerCelebration("📤 Uploading image to IPFS...");
        const imageUri = await uploadToIPFS(file);
        
        // Convert ipfs:// to gateway url for local display
        finalImageUrl = imageUri.replace("ipfs://", "https://aquamarine-rainy-dinosaur-738.mypinata.cloud/ipfs/");

        triggerCelebration("🧾 Generating metadata...");
        const metadata = {
          name: `MeeBot: ${prompt}`,
          description: "Mystical MeeBot born from the RitualChain.",
          image: imageUri,
          attributes: [
            { trait_type: "Theme", value: prompt },
            { trait_type: "Ritual", value: "Genesis" }
          ],
        };

        tokenUri = await uploadJSONToIPFS(metadata);
        triggerCelebration("✨ Metadata pinned to IPFS!");
      } else {
        // Fallback image for text-only mints
        finalImageUrl = `https://placehold.co/400x400/23212d/f25f4c?text=${encodeURIComponent(prompt.substring(0, 10))}`;
      }

      await writeContractAsync({
        address: CONTRACT_ADDRESSES.MeeBotNFT as `0x${string}`,
        abi: MeeBotNFTAbi,
        functionName: "mintMeeBot",
        args: [tokenUri], 
      });
      
      playMintSound(); // 🔊 Play Sound
      triggerCelebration(t("celebration.mint.success"));
      
      // Set Success Result
      setMintedBot({
        name: `MeeBot: ${prompt}`,
        image: finalImageUrl,
        desc: "Summoned successfully from the void."
      });

      // Reset form inputs (but keep result on screen)
      setPrompt("");
      setFile(null);
      setPreviewUrl(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      
    } catch (e: any) {
      console.error(e);
      triggerCelebration(t("celebration.mint.fail") + (e.message ? ` (${e.message})` : ""));
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setMintedBot(null); // Clear previous result when starting new
      
      // Create object URL for preview
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    }
  };

  const handleClearFile = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the container click
    setFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  const isLoading = isPending || isUploading;

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 relative">
      {/* Local Debug Overlay: Positioned absolute top-right of this container */}
      <DebugOverlay 
        className="absolute top-0 right-0 z-50" 
        file={file} 
        extra={{ 
            isUploading, 
            hasPreview: !!previewUrl,
            promptLen: prompt.length
        }} 
      />

      <div className="grid lg:grid-cols-2 gap-12 items-start">
        
        {/* Left Column: Form */}
        <div className="bg-meebot-surface border border-meebot-border rounded-2xl p-8 shadow-2xl relative overflow-hidden animate-slide-in-left">
            {/* Decorative Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-meebot-highlight/10 blur-[80px] rounded-full pointer-events-none"></div>

            <h2 className="text-3xl font-bold text-meebot-text-primary mb-2 flex items-center gap-3">
                <span>🪄</span> {t("genesis.title")}
            </h2>
            <p className="text-meebot-text-secondary mb-8">{t("genesis.desc")}</p>

            <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-meebot-text-secondary mb-2">Theme Prompt</label>
                <input
                    value={prompt}
                    onChange={(e) => {
                        setPrompt(e.target.value);
                        if (mintedBot) setMintedBot(null); // Clear result if user types
                    }}
                    placeholder={t("genesis.placeholder")}
                    disabled={isLoading}
                    className="w-full bg-meebot-bg border border-meebot-border rounded-lg px-4 py-3 text-meebot-text-primary focus:outline-none focus:border-meebot-highlight transition-colors placeholder:text-meebot-text-secondary/30 disabled:opacity-50"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-meebot-text-secondary mb-2">MeeBot Image (Optional)</label>
                <div 
                onClick={() => !isLoading && fileInputRef.current?.click()}
                className={`w-full border-2 border-dashed rounded-lg p-1 flex flex-col items-center justify-center cursor-pointer transition-all hover:border-meebot-highlight/50 hover:bg-meebot-bg/50 ${
                    isLoading ? 'opacity-50 pointer-events-none' : ''
                } ${file ? 'border-meebot-accent bg-meebot-accent/5' : 'border-meebot-border'}`}
                >
                <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileChange} 
                    accept="image/*" 
                    className="hidden"
                />
                
                {file && previewUrl ? (
                    <div className="relative w-full h-48 rounded-lg overflow-hidden group/preview">
                        <img 
                            src={previewUrl} 
                            alt="Preview" 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover/preview:scale-105" 
                        />
                        
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex flex-col items-center justify-center opacity-0 group-hover/preview:opacity-100 transition-opacity duration-300">
                            <span className="text-3xl mb-2">🔄</span>
                            <p className="text-white font-bold tracking-wide">Change Image</p>
                        </div>

                        <button 
                            onClick={handleClearFile}
                            className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-600 text-white p-2 rounded-full backdrop-blur-md shadow-lg transition-transform hover:scale-110 z-10"
                            title="Remove image"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                        </button>
                        
                        <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md px-3 py-1 rounded text-xs text-white/90 truncate max-w-[80%] border border-white/10">
                            {file.name}
                        </div>
                    </div>
                ) : (
                    <div className="py-10 text-center">
                    <span className="text-3xl mb-2 block text-meebot-text-secondary">📤</span>
                    <p className="text-sm text-meebot-text-secondary font-medium">Click to summon an image file</p>
                    <p className="text-xs text-meebot-text-secondary/50 mt-1">JPG, PNG, GIF up to 5MB</p>
                    </div>
                )}
                </div>
            </div>

            <button 
                onClick={handleMint} 
                disabled={isLoading || !prompt}
                className={`w-full py-4 rounded-lg font-bold text-lg transition-all duration-300 transform active:scale-95 relative overflow-hidden ${
                    isLoading || !prompt 
                    ? "bg-meebot-border text-meebot-text-secondary cursor-not-allowed" 
                    : "bg-gradient-to-r from-meebot-highlight to-orange-600 text-white shadow-[0_0_20px_rgba(242,95,76,0.4)] hover:shadow-[0_0_30px_rgba(242,95,76,0.6)]"
                }`}
            >
                <span className="relative z-10 flex items-center justify-center gap-2">
                    {isUploading ? (
                        <>
                            <span className="animate-spin">⏳</span> Uploading to IPFS...
                        </>
                    ) : isPending ? (
                        <>
                            <span className="animate-pulse">⚡</span> Summoning...
                        </>
                    ) : (
                        t("genesis.button")
                    )}
                </span>
            </button>
            </div>
        </div>

        {/* Right Column: The Altar / Preview */}
        <div className="relative animate-slide-in-right">
             {/* Background Effects for the Altar */}
             <div className="absolute inset-0 bg-meebot-surface/30 rounded-full blur-[100px] -z-10"></div>
             
             {/* The Card Container */}
             <div className={`relative w-full aspect-[3/4] rounded-2xl border-2 transition-all duration-700 overflow-hidden flex flex-col ${
                 isLoading 
                    ? "border-meebot-accent shadow-[0_0_50px_rgba(255,137,6,0.4)] animate-pulse" 
                    : mintedBot 
                        ? "border-meebot-highlight shadow-[0_0_30px_rgba(242,95,76,0.3)]"
                        : "border-meebot-border/50 border-dashed bg-meebot-bg/30"
             }`}>
                
                {/* STATE 1: LOADING (SUMMONING) */}
                {isLoading && (
                    <div className="absolute inset-0 z-20 bg-black/80 flex flex-col items-center justify-center text-center p-6 backdrop-blur-sm">
                        <div className="w-32 h-32 relative mb-6">
                            <div className="absolute inset-0 border-4 border-transparent border-t-meebot-accent rounded-full animate-spin"></div>
                            <div className="absolute inset-4 border-4 border-transparent border-l-meebot-highlight rounded-full animate-spin-reverse"></div>
                            <div className="absolute inset-0 flex items-center justify-center text-4xl animate-pulse">⚡</div>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2 animate-bounce">Summoning...</h3>
                        <p className="text-meebot-text-secondary">Channeling prompt: "{prompt}"</p>
                        
                        {/* Show phantom preview of what is being minted */}
                        {previewUrl && (
                             <img src={previewUrl} alt="Ghost" className="absolute inset-0 w-full h-full object-cover opacity-20 -z-10 grayscale mix-blend-overlay" />
                        )}
                    </div>
                )}

                {/* STATE 2: SUCCESS (RESULT) */}
                {!isLoading && mintedBot && (
                    <div className="h-full flex flex-col animate-float">
                        <div className="relative flex-1 bg-meebot-bg overflow-hidden group">
                             <img 
                                src={mintedBot.image} 
                                alt="Minted Bot" 
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                            <div className="absolute bottom-6 left-6 right-6">
                                <span className="inline-block px-3 py-1 mb-2 bg-meebot-highlight text-white text-xs font-bold rounded shadow-lg uppercase tracking-wider">
                                    Ritual Complete
                                </span>
                                <h3 className="text-3xl font-bold text-white mb-1">{mintedBot.name}</h3>
                                <p className="text-meebot-text-secondary text-sm">{mintedBot.desc}</p>
                            </div>
                            
                            {/* Shiny Overlay Effect */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent skew-x-12 translate-x-[-200%] animate-[shimmer_2s_infinite]"></div>
                        </div>
                        <div className="bg-meebot-surface p-4 border-t border-meebot-border flex justify-between items-center">
                             <div className="flex flex-col">
                                <span className="text-xs text-meebot-text-secondary">Status</span>
                                <span className="text-green-400 font-bold text-sm flex items-center gap-1">
                                    ● On-Chain
                                </span>
                             </div>
                             <div className="flex flex-col items-end">
                                <span className="text-xs text-meebot-text-secondary">Rarity</span>
                                <span className="text-meebot-accent font-bold text-sm">Genesis</span>
                             </div>
                        </div>
                    </div>
                )}

                {/* STATE 3: IDLE (WAITING) */}
                {!isLoading && !mintedBot && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 text-meebot-text-secondary/40">
                        {previewUrl ? (
                            // Previewing file before mint
                            <div className="relative w-full h-full flex flex-col">
                                 <img src={previewUrl} className="w-full h-full object-cover opacity-60 rounded-xl" alt="Preview" />
                                 <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                     <p className="text-white font-bold text-lg px-4 py-2 bg-black/50 backdrop-blur rounded-lg border border-white/20">
                                         Ready to Summon
                                     </p>
                                 </div>
                            </div>
                        ) : (
                            // Empty State
                            <>
                                <span className="text-6xl mb-4 opacity-50">🔮</span>
                                <h3 className="text-xl font-bold text-meebot-text-secondary mb-2">The Altar is Empty</h3>
                                <p className="text-sm max-w-xs">
                                    Enter a prompt or upload an image to preview your offering before the ritual begins.
                                </p>
                            </>
                        )}
                    </div>
                )}

             </div>
             
             {/* Flavor Text below altar */}
             <div className="text-center mt-6 text-meebot-text-secondary text-xs tracking-widest uppercase opacity-60">
                 RitualChain Genesis Protocol v1.0
             </div>
        </div>

      </div>
      <style>{`
        @keyframes spin-reverse {
            from { transform: rotate(360deg); }
            to { transform: rotate(0deg); }
        }
        .animate-spin-reverse {
            animation: spin-reverse 3s linear infinite;
        }
        @keyframes shimmer {
            100% { transform: translateX(200%); }
        }
        @keyframes slideInLeft {
            from { opacity: 0; transform: translateX(-20px); }
            to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
            from { opacity: 0; transform: translateX(20px); }
            to { opacity: 1; transform: translateX(0); }
        }
        .animate-slide-in-left {
            animation: slideInLeft 0.5s ease-out forwards;
        }
        .animate-slide-in-right {
            animation: slideInRight 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default GenesisPage;