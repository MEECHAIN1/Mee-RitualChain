export type Language = 'en' | 'th';

export interface CelebrationContextType {
  triggerCelebration: (message: string) => void;
}

export interface TranslationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

export interface ContractEvent {
  message: string;
  timestamp: Date;
  type: 'mint' | 'stake' | 'unstake' | 'claim';
}
