import React from 'react';
import { motion } from 'framer-motion';

const QuestTracker: React.FC = () => {
  const quests = [
    { id: 1, name: "First Ritual", progress: 100, reward: "10 MCB" },
    { id: 2, name: "Void Miner", progress: 45, reward: "25 MCB" },
    { id: 3, name: "Bot Summoner", progress: 20, reward: "NFT Gear" }
  ];

  return (
    <div className="bg-meebot-surface border border-meebot-border rounded-2xl p-6 shadow-xl">
      <h2 className="text-xl font-bold text-meebot-accent mb-6 flex items-center gap-2">
        <span>📜</span> Quest Tracker
      </h2>
      
      <div className="space-y-6">
        {quests.map((quest) => (
          <div key={quest.id} className="space-y-2">
            <div className="flex justify-between items-end text-sm">
              <span className="font-bold text-meebot-text-primary">{quest.name}</span>
              <span className="text-meebot-text-secondary">{quest.progress}%</span>
            </div>
            <div className="h-2 bg-black/30 rounded-full overflow-hidden border border-meebot-border">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${quest.progress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`h-full ${quest.progress === 100 ? 'bg-green-500' : 'bg-meebot-accent'}`}
              />
            </div>
            <div className="flex justify-between items-center text-[10px] uppercase tracking-wider text-meebot-text-secondary/60">
              <span>Reward: {quest.reward}</span>
              {quest.progress === 100 && <span className="text-green-400 font-bold">Completed</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestTracker;
