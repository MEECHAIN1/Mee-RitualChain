import React, { useEffect, useState } from "react";
import { useTranslation } from "../utils/TranslationProvider";
import { Link } from "react-router-dom";
import { usePublicClient, useReadContract } from "wagmi";
import { formatUnits } from "viem";
import { MeeBotNFTAbi } from "../abi/MeeBotNFT";
import { ERC20Abi } from "../abi/ERC20";
import { CONTRACT_ADDRESSES } from "../constants/addresses";
import { getGatewayUrl, getMeeBotImageUrl } from "../utils/ipfs";

const StatCard: React.FC<{ label: string; value: string; icon: string }> = ({ label, value, icon }) => (
  <div className="bg-meebot-surface border border-meebot-border p-6 rounded-2xl hover:border-meebot-accent/50 transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,137,6,0.15)] group">
    <div className="flex justify-between items-start mb-4">
        <h3 className="text-meebot-text-secondary font-medium">{label}</h3>
        <span className="text-2xl group-hover:scale-110 transition-transform">{icon}</span>
    </div>
    <p className="text-3xl font-bold text-meebot-text-primary">{value}</p>
  </div>
);

const MeeBotCard: React.FC<{ bot: any }> = ({ bot }) => (
  <div className="bg-meebot-surface border border-meebot-border rounded-xl overflow-hidden hover:shadow-[0_0_20px_rgba(242,95,76,0.2)] transition-all group animate-float" style={{ animationDuration: '4s' }}>
    <div className="aspect-square bg-meebot-bg relative overflow-hidden flex items-center justify-center">
      {bot.image ? (
        <img 
            src={bot.image} 
            alt={bot.name} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/400x400/23212d/f25f4c?text=Ritual+Image"; }}
        />
      ) : (
        <div className="text-6xl opacity-20">🤖</div>
      )}
      <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-xs text-white border border-white/10">
        #{bot.tokenId}
      </div>
    </div>
    <div className="p-4">
        <h4 className="font-bold text-meebot-text-primary truncate">{bot.name}</h4>
        <p className="text-xs text-meebot-text-secondary mt-1 truncate opacity-70">{bot.description}</p>
    </div>
      <div className="animate-meechain-dapp bg-slate-900 p-6 rounded-2xl border border-amber-500/20">
        <h1 className="text-2xl font-bold text-amber-500">MeeChain DApp Initialized</h1>
        <p className="text-slate-400">ระบบเริ่มต้นการทำงานเรียบร้อย...</p>
      </div>
  </div>
);

import AvatarCustomizer from "../components/AvatarCustomizer";

const DashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const client = usePublicClient();
  const [ritualCount, setRitualCount] = useState<number>(0);
  const [myMeeBots, setMyMeeBots] = useState<any[]>([]);

  const { data: tvl } = useReadContract({
    address: CONTRACT_ADDRESSES.MeeToken as `0x${string}`,
    abi: ERC20Abi,
    functionName: "balanceOf",
    args: [CONTRACT_ADDRESSES.MeeBotStaking],
  });

  const { data: minted } = useReadContract({
    address: CONTRACT_ADDRESSES.MeeBotNFT as `0x${string}`,
    abi: MeeBotNFTAbi,
    functionName: "totalSupply",
    args: [],
  });

  useEffect(() => {
    if (!client) return;
    
    const fetchLogs = async () => {
        try {
            // Safe event lookup
            const mintEvent = MeeBotNFTAbi.find(x => x.type === 'event' && x.name === 'MeeBotMinted');
            
            const [nftLogs, stakingLogs] = await Promise.all([
                client.getLogs({
                    address: CONTRACT_ADDRESSES.MeeBotNFT as `0x${string}`,
                    event: { type: 'event', name: 'MeeBotMinted', inputs: mintEvent?.inputs || [] } as any,
                    fromBlock: 'earliest',
                }),
                client.getLogs({
                    address: CONTRACT_ADDRESSES.MeeBotStaking as `0x${string}`,
                    fromBlock: 'earliest',
                }),
            ]);
            
            setRitualCount((nftLogs?.length || 0) + (stakingLogs?.length || 0));

            if (!nftLogs) return;

            // Parse NFT Logs to get Metadata
            const bots = await Promise.all(nftLogs.map(async (log: any) => {
                // Defensive check: Ensure log, args, and tokenId exist before accessing .toString()
                if (!log || !log.args || log.args.tokenId == null) return null;
                
                try {
                    const tokenId = log.args.tokenId.toString();
                    const rawUri = log.args.prompt || "";
                    
                    let botData = {
                        tokenId,
                        name: `MeeBot #${tokenId}`,
                        description: rawUri,
                        image: ""
                    };

                    // Check if URI is an IPFS link
                    if (rawUri && rawUri.startsWith("ipfs://")) {
                        const metadataUrl = getGatewayUrl(rawUri);
                        const res = await fetch(metadataUrl);
                        if (res.ok) {
                            const metadata = await res.json();
                            botData.name = metadata.name || botData.name;
                            botData.description = metadata.description || botData.description;
                            
                            if (metadata.image) {
                                botData.image = getMeeBotImageUrl(metadata.image);
                            }
                        }
                    }

                    return botData;
                } catch (err) {
                    console.warn("Skipping invalid log", err);
                    return null;
                }
            }));

            setMyMeeBots(bots.filter(b => b !== null));

        } catch (e) {
            console.error("Failed to fetch logs", e);
        }
    };
    
    fetchLogs();
  }, [client]);

  const formattedTvl = tvl ? formatUnits(tvl as bigint, 18) : "0";
  const formattedMinted = minted?.toString() || "0";

  return (
    <div className="space-y-8 animate-float">
      <header className="text-center py-10">
        <h2 className="text-4xl md:text-5xl font-bold text-meebot-text-primary mb-4">
            {t("dash.welcome")}
        </h2>
        <p className="text-meebot-text-secondary max-w-lg mx-auto">
            Review your assets, check the network status, and prepare for your next ritual.
        </p>
      </header>

      {/* Avatar Customization Section */}
      <div className="max-w-2xl mx-auto">
        <AvatarCustomizer />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <StatCard 
            label="Total Value Locked" 
            value={`${Number(formattedTvl).toFixed(2)} MCB`} 
            icon="💎" 
        />
        <StatCard 
            label="MeeBots Minted" 
            value={formattedMinted} 
            icon="🤖" 
        />
        <StatCard 
            label="Rituals Performed" 
            value={ritualCount.toString()} 
            icon="🔥" 
        />
      </div>

      {/* NFT Gallery Section */}
      <div className="mt-12">
        <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-meebot-text-primary flex items-center gap-2">
                <span>🖼️</span> Your Collection
            </h3>
            <Link to="/gallery" className="text-meebot-accent hover:text-white transition-colors text-sm font-bold flex items-center gap-1 group">
                View Full Gallery <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
        </div>
        
        {myMeeBots.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {myMeeBots.slice(0, 4).map((bot) => ( // Limit to 4 for dashboard
                    <MeeBotCard key={bot.tokenId} bot={bot} />
                ))}
            </div>
        ) : (
            <div className="bg-meebot-surface/50 border border-dashed border-meebot-border rounded-xl p-12 text-center text-meebot-text-secondary">
                <p className="text-xl mb-4">No MeeBots found in your altar.</p>
                <Link to="/genesis" className="text-meebot-accent hover:underline">Summon one now →</Link>
            </div>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-6 mt-12">
        <Link to="/genesis" className="bg-gradient-to-br from-meebot-surface to-meebot-bg border border-meebot-border p-8 rounded-2xl hover:border-meebot-highlight/50 transition-all group">
            <h3 className="text-2xl font-bold text-meebot-highlight mb-2 flex items-center gap-2">
                Start Genesis <span className="group-hover:translate-x-1 transition-transform">→</span>
            </h3>
            <p className="text-meebot-text-secondary">Create a new MeeBot and join the ecosystem.</p>
        </Link>
        <Link to="/staking" className="bg-gradient-to-br from-meebot-surface to-meebot-bg border border-meebot-border p-8 rounded-2xl hover:border-meebot-accent/50 transition-all group">
            <h3 className="text-2xl font-bold text-meebot-accent mb-2 flex items-center gap-2">
                Enter Staking <span className="group-hover:translate-x-1 transition-transform">→</span>
            </h3>
            <p className="text-meebot-text-secondary">Earn passive yield by locking your MCB tokens.</p>
        </Link>
        <Link to="/gallery" className="bg-gradient-to-br from-meebot-surface to-meebot-bg border border-meebot-border p-8 rounded-2xl hover:border-meebot-text-primary/50 transition-all group">
            <h3 className="text-2xl font-bold text-meebot-text-primary mb-2 flex items-center gap-2">
                View Gallery <span className="group-hover:translate-x-1 transition-transform">→</span>
            </h3>
            <p className="text-meebot-text-secondary">Browse the full collection of summoned MeeBots.</p>
        </Link>
      </div>
    </div>
  );
};

export default DashboardPage;