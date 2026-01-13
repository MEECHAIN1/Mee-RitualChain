import React, { createContext, useContext, useState, useEffect } from 'react';

export type AvatarOptions = {
  skinColor: string;
  clothing: string;
  accessory: string;
  expression: string;
};

interface AvatarContextType {
  avatar: AvatarOptions;
  setAvatar: (avatar: AvatarOptions) => void;
  saveAvatar: (avatar: AvatarOptions) => void;
}

const defaultAvatar: AvatarOptions = {
  skinColor: '#FFDBAC',
  clothing: 'tshirt',
  accessory: 'none',
  expression: 'smile',
};

const AvatarContext = createContext<AvatarContextType | undefined>(undefined);

export const AvatarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [avatar, setAvatar] = useState<AvatarOptions>(defaultAvatar);

  useEffect(() => {
    const saved = localStorage.getItem('ritual_avatar');
    if (saved) {
      try {
        setAvatar(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load avatar", e);
      }
    }
  }, []);

  const saveAvatar = (newAvatar: AvatarOptions) => {
    setAvatar(newAvatar);
    localStorage.setItem('ritual_avatar', JSON.stringify(newAvatar));
  };

  return (
    <AvatarContext.Provider value={{ avatar, setAvatar, saveAvatar }}>
      {children}
    </AvatarContext.Provider>
  );
};

export const useAvatar = () => {
  const context = useContext(AvatarContext);
  if (!context) {
    throw new Error('useAvatar must be used within an AvatarProvider');
  }
  return context;
};
