// Mystical Sound Effects using Web Audio API
// No external files required.

const getCtx = () => {
  const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContext) return null;
  return new AudioContext();
};

export const playMintSound = () => {
  const ctx = getCtx();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  // Magical Chime (Sine wave, High Pitch A5)
  osc.type = "sine";
  osc.frequency.setValueAtTime(880, ctx.currentTime); 
  
  // Envelope
  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.1);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.5); // Long sustain

  osc.connect(gain).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 1.5);
  
  // Harmonics for sparkle
  const osc2 = ctx.createOscillator();
  const gain2 = ctx.createGain();
  osc2.type = "triangle";
  osc2.frequency.setValueAtTime(1760, ctx.currentTime); // Octave up
  gain2.gain.setValueAtTime(0, ctx.currentTime);
  gain2.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.1);
  gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.0);
  
  osc2.connect(gain2).connect(ctx.destination);
  osc2.start();
  osc2.stop(ctx.currentTime + 1.0);
};

export const playStakeSound = () => {
  const ctx = getCtx();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  // Energy Power-up (Sawtooth)
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(110, ctx.currentTime); // Low A2
  osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.5); // Pitch up

  gain.gain.setValueAtTime(0.2, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);

  osc.connect(gain).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.5);
};

export const playUnstakeSound = () => {
  const ctx = getCtx();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  // Power-down (Sawtooth)
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(220, ctx.currentTime); 
  osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.5); // Pitch down

  gain.gain.setValueAtTime(0.2, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);

  osc.connect(gain).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.5);
};

export const playClaimSound = () => {
  const ctx = getCtx();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  // Success Coin (Triangle)
  osc.type = "triangle";
  osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
  osc.frequency.setValueAtTime(1046.50, ctx.currentTime + 0.1); // Jump to C6

  gain.gain.setValueAtTime(0.2, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);

  osc.connect(gain).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.6);
};