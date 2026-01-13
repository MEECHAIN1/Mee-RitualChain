import React, { useEffect, useState } from "react";
import { useTranslation } from "../utils/TranslationProvider";
import { Link } from "react-router-dom";
import { usePublicClient, useReadContract } from "wagmi";
import { formatUnits } from "viem";
import { MeeBotNFTAbi } from "../abi/MeeBotNFT";
import { ERC20Abi } from "../abi/ERC20";
import { CONTRACT_ADDRESSES } from "../constants/addresses";
import { getGatewayUrl, getMeeBotImageUrl } from "../utils/ipfs";
import AvatarCustomizer from "../components/AvatarCustomizer";

// --- Components ย่อย ---

const StatCard: React.FC<{ label: string; value: string; icon: string }> = ({ label, value, icon }) => (
  <div className="bg-meebot-surface/50 border border-meebot-border p-6 rounded-2xl hover:border-meebot-accent/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,137,6,0.1)] group backdrop-blur-sm">
    <div className="flex justify-between items-start mb-4">
        <h3 className="text-meebot-text-secondary font-bold text-sm uppercase tracking-wider">{label}</h3>
        <span className="text-2xl group-hover:rotate-12 transition-transform">{icon}</span>
    </div>
    <p className="text-3xl font-black text-white">{value}</p>
  </div>
);

const MeeBotCard: React.FC<{ bot: any }> = ({ bot }) => (
  <div className="bg-meebot-surface border border-meebot-border rounded-2xl overflow-hidden hover:border-meebot-accent transition-all duration-500 group relative">
    <div className="aspect-square bg-black/40 relative overflow-hidden flex items-center justify-center">
      {bot.image ? (
        <img 
            src={bot.image} 
            alt={bot.name} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/400x400/23212d/f25f4c?text=MeeBot"; }}
        />
      ) : (
        <div className="text-6xl opacity-20 animate-pulse">🤖</div>
      )}
      <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-meebot-accent border border-meebot-accent/30">
        ID: #{bot.tokenId}
      </div>
    </div>
    <div className="p-4 bg-gradient-to-b from-transparent to-black/20">
        <h4 className="font-bold text-white truncate text-lg">{bot.name}</h4>
        <p className="text-xs text-meebot-text-secondary mt-1 line-clamp-2 min-h-[32px]">{bot.description || "No description provided."}</p>
    </div>
  </div>
);

// --- Main Page ---

const DashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const client = usePublicClient();
  const [ritualCount, setRitualCount] = useState<number>(0);
  const [myMeeBots, setMyMeeBots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ดึงข้อมูลยอด MCB ที่ถูก Lock (TVL)
  const { data: tvl } = useReadContract({
    address: CONTRACT_ADDRESSES.MeeToken as `0x${string}`,
    abi: ERC20Abi,
    functionName: "balanceOf",
    args: [CONTRACT_ADDRESSES.MeeBotStaking],
  });

  // ดึงจำนวน NFT ทั้งหมดที่ถูก Mint
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
            setLoading(true);
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

            if (nftLogs) {
                const bots = await Promise.all(nftLogs.map(async (log: any) => {
                    if (!log || !log.args || log.args.tokenId == null) return null;
                    try {
                        const tokenId = log.args.tokenId.toString();
                        const rawUri = log.args.prompt || "";
                        let botData = { tokenId, name: `MeeBot #${tokenId}`, description: rawUri, image: "" };

                        if (rawUri && rawUri.startsWith("ipfs://")) {
                            const metadataUrl = getGatewayUrl(rawUri);
                            const res = await fetch(metadataUrl);
                            if (res.ok) {
                                const metadata = await res.json();
                                botData.name = metadata.name || botData.name;
                                botData.description = metadata.description || botData.description;
                                if (metadata.image) botData.image = getMeeBotImageUrl(metadata.image);
                            }
                        }
                        return botData;
                    } catch (err) { return null; }
                }));
                setMyMeeBots(bots.filter(b => b !== null));
            }
        } catch (e) {
            console.error("Failed to fetch logs", e);
        } finally {
            setLoading(false);
        }
    };
    
    fetchLogs();
  }, [client]);

  const formattedTvl = tvl ? formatUnits(tvl as bigint, 18) : "0";
  const formattedMinted = minted?.toString() || "0";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Header Section */}
      <header className="text-center space-y-4">
        <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight italic">
            {t("dash.welcome")}
        </h2>
        <p className="text-meebot-text-secondary max-w-2xl mx-auto text-lg">
            Manage your digital assets, monitor network health, and execute your next blockchain ritual.
        </p>
      </header>

      {/* Avatar Customization - Focus Area */}
      <section className="bg-gradient-to-b from-meebot-surface/30 to-transparent p-1 rounded-3xl border border-meebot-border/50">
        <AvatarCustomizer />
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Total Value Locked" value={`${Number(formattedTvl).toLocaleString()} MCB`} icon="💎" />
        <StatCard label="MeeBots Minted" value={formattedMinted} icon="🤖" />
        <StatCard label="Rituals Performed" value={ritualCount.toString()} icon="🔥" />
      </section>

      {/* NFT Gallery Section */}
      <section className="space-y-6">
        <div className="flex items-end justify-between border-b border-meebot-border pb-4">
            <div>
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                  <span className="text-meebot-accent">🖼️</span> Your Collection
              </h3>
              <p className="text-sm text-meebot-text-secondary mt-1">Recently summoned units in your command.</p>
            </div>
            <Link to="/gallery" className="px-4 py-2 bg-meebot-surface border border-meebot-border rounded-xl text-sm font-bold hover:bg-meebot-accent hover:text-white transition-all">
                Full Gallery →
            </Link>
        </div>
        
        {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
                {[1,2,3,4].map(i => <div key={i} className="aspect-square bg-meebot-surface rounded-2xl border border-meebot-border" />)}
            </div>
        ) : myMeeBots.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {myMeeBots.slice(0, 4).map((bot) => <MeeBotCard key={bot.tokenId} bot={bot} />)}
            </div>
        ) : (
            <div className="bg-meebot-surface/30 border-2 border-dashed border-meebot-border rounded-3xl p-16 text-center group cursor-pointer hover:border-meebot-accent/50 transition-colors">
                <div className="text-5xl mb-4 grayscale group-hover:grayscale-0 transition-all">🌑</div>
                <p className="text-xl text-meebot-text-secondary mb-6 font-medium">No MeeBots found in your altar.</p>
                <Link to="/genesis" className="inline-block px-8 py-3 bg-meebot-accent text-white rounded-full font-bold shadow-lg shadow-meebot-accent/20 hover:scale-105 transition-transform">
                    Summon MeeBot Now
                </Link>
            </div>
        )}
      </section>

      {/* Action Links */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        {[
          { to: "/genesis", title: "Genesis", desc: "Create new units", color: "text-meebot-highlight", icon: "✨" },
          { to: "/staking", title: "Staking", desc: "Earn MCB rewards", color: "text-meebot-accent", icon: "⚡" },
          { to: "/gallery", title: "Archive", desc: "Browse collection", color: "text-white", icon: "📚" }
        ].map((item, idx) => (
          <Link key={idx} to={item.to} className="group bg-meebot-surface/50 border border-meebot-border p-8 rounded-3xl hover:bg-meebot-accent/5 hover:border-meebot-accent transition-all">
              <div className="text-3xl mb-4">{item.icon}</div>
              <h3 className={`text-2xl font-bold ${item.color} mb-2 flex items-center gap-2`}>
                  {item.title} <span className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">→</span>
              </h3>
              <p className="text-meebot-text-secondary text-sm">{item.desc}</p>
          </Link>
        ))}
      </section>
    </div>
  );
};

export default DashboardPage;