import React from 'react';
import { motion } from 'framer-motion';
import './Neonova.css';

const SummonPortal: React.FC = () => {
  return (
    <div className="summon-container min-h-screen flex flex-col items-center pt-32 bg-neonova-nebula">

      <div className="relative flex justify-center items-center h-80 w-80">

        {/* วงแหวน: ใช้การหมุนที่นุ่มนวล ไม่กระพริบ */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="gate-ring absolute w-full h-full border-2 border-dashed border-cyan-400/40 rounded-full"
          style={{ boxShadow: "0 0 20px rgba(34, 211, 238, 0.2)" }}
        />

        {/* รูปมือ (Core): ใส่แอนิเมชัน "หายใจ" (Pulse) แทนการหมุน เพื่อลดอาการ Flicker */}
        <motion.img
          src="/assets/quantum-hand.png"
          animate={{
            opacity: [0.7, 1, 0.7],
            scale: [0.98, 1, 0.98]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="z-10 w-48 drop-shadow-[0_0_30px_rgba(34,211,238,0.5)]"
          alt="Quantum Core"
        />
      </div>

      {/* แถบ Nova Pulse Alignment */}
      <div className="luck-indicator w-[90%] max-w-md mt-4">
        <div className="flex justify-between text-cyan-400 text-[10px] uppercase tracking-[0.2em] mb-3 font-bold">
          <span className="drop-shadow-[0_0_5px_rgba(34, 211, 238, 1)]">Nova Pulse alignment</span>
          <span>Luck: 5/100</span>
        </div>
        <div className="h-2.5 bg-black/40 rounded-full border border-cyan-500/30 overflow-hidden backdrop-blur-sm">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '5%' }}
            className="h-full bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-pink-500 shadow-[0_0_15px_#ff69b4]"
          />
        </div>
        <p className="text-[10px] text-cyan-300/60 mt-4 text-center tracking-wider italic">
          "รับประกันไอเทมระดับ R ในอีก 95 ครั้ง"
        </p>
      </div>

      {/* ปุ่มกดอัญเชิญ */}
      <div className="action-buttons flex gap-4 mt-10">
        <button className="px-8 py-3 bg-cyan-600/20 border border-cyan-400 text-cyan-100 rounded-lg hover:bg-cyan-500/40 transition-all shadow-[0_0_15px_rgba(34, 211, 238, 0.3)] text-sm font-bold tracking-widest">
          SINGLE PULSE (1💎)
        </button>
        <button className="px-8 py-3 bg-pink-600/20 border border-pink-400 text-pink-100 rounded-lg hover:bg-pink-500/40 transition-all shadow-[0_0_15px_rgba(236,72,153,0.3)] text-sm font-bold tracking-widest">
          NOVA BURST X10 (10💎)
        </button>
      </div>
    </div>
  );
};

export { SummonPortal };
