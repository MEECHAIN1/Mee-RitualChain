import React from 'react';
import { useAvatar, AvatarOptions } from '../context/AvatarContext';

const SKIN_COLORS = ['#FFDBAC', '#F1C27D', '#E0AC69', '#8D5524', '#C68642'];
const CLOTHING_OPTIONS = ['tshirt', 'hoodie', 'robe', 'armor', 'suit'];
const ACCESSORY_OPTIONS = ['none', 'glasses', 'hat', 'necklace', 'earrings'];
const EXPRESSION_OPTIONS = ['smile', 'neutral', 'surprised', 'cool', 'happy'];

const AvatarCustomizer: React.FC = () => {
  const { avatar, saveAvatar } = useAvatar();

  const updateAvatar = (key: keyof AvatarOptions, value: string) => {
    saveAvatar({ ...avatar, [key]: value });
  };

  return (
    <div className="bg-meebot-surface border border-meebot-border rounded-2xl p-6 shadow-xl space-y-8">
      <div className="flex flex-col items-center">
        <h2 className="text-2xl font-bold text-meebot-accent mb-6">Customize Avatar</h2>
        
        {/* Avatar Preview (Simple Placeholder representation) */}
        <div 
          className="w-32 h-32 rounded-full border-4 border-meebot-accent relative flex items-center justify-center overflow-hidden mb-4"
          style={{ backgroundColor: avatar.skinColor }}
        >
           <span className="text-4xl">
             {avatar.expression === 'smile' && '😊'}
             {avatar.expression === 'neutral' && '😐'}
             {avatar.expression === 'surprised' && '😲'}
             {avatar.expression === 'cool' && '😎'}
             {avatar.expression === 'happy' && '😁'}
           </span>
           <div className="absolute bottom-0 w-full h-1/3 bg-white/20 flex items-center justify-center text-[10px] font-bold uppercase">
             {avatar.clothing}
           </div>
           {avatar.accessory !== 'none' && (
             <div className="absolute top-2 right-2 text-sm">
                {avatar.accessory === 'glasses' && '👓'}
                {avatar.accessory === 'hat' && '🎩'}
                {avatar.accessory === 'necklace' && '📿'}
                {avatar.accessory === 'earrings' && '✨'}
             </div>
           )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Skin Color */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-meebot-text-secondary uppercase">Skin Color</label>
          <div className="flex gap-2 flex-wrap">
            {SKIN_COLORS.map(color => (
              <button
                key={color}
                onClick={() => updateAvatar('skinColor', color)}
                className={`w-8 h-8 rounded-full border-2 ${avatar.skinColor === color ? 'border-white' : 'border-transparent'}`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        {/* Expression */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-meebot-text-secondary uppercase">Expression</label>
          <div className="flex gap-2 flex-wrap">
            {EXPRESSION_OPTIONS.map(opt => (
              <button
                key={opt}
                onClick={() => updateAvatar('expression', opt)}
                className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all ${avatar.expression === opt ? 'bg-meebot-accent text-white border-meebot-accent' : 'bg-meebot-bg text-meebot-text-secondary border-meebot-border'}`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Clothing */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-meebot-text-secondary uppercase">Clothing</label>
          <div className="flex gap-2 flex-wrap">
            {CLOTHING_OPTIONS.map(opt => (
              <button
                key={opt}
                onClick={() => updateAvatar('clothing', opt)}
                className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all ${avatar.clothing === opt ? 'bg-meebot-accent text-white border-meebot-accent' : 'bg-meebot-bg text-meebot-text-secondary border-meebot-border'}`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Accessory */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-meebot-text-secondary uppercase">Accessory</label>
          <div className="flex gap-2 flex-wrap">
            {ACCESSORY_OPTIONS.map(opt => (
              <button
                key={opt}
                onClick={() => updateAvatar('accessory', opt)}
                className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all ${avatar.accessory === opt ? 'bg-meebot-accent text-white border-meebot-accent' : 'bg-meebot-bg text-meebot-text-secondary border-meebot-border'}`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvatarCustomizer;
