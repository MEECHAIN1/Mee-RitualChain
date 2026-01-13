import React from 'react';
import { useApp } from '../../services/context/AppState';
import { SummonPortal } from '../Neonova/Portal';

const SummonPage = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#0f0e17]">
      {/* 1. ส่วนแสดงผล Portal (วงแหวนเวทย์) */}
      <SummonPortal />

      {/* 2. ส่วนแสดงผลรูปภาพตรงกลาง (Quantum Core) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <img
          src="/assets/neonova-silhouette.png"
          alt="Quantum Core"
          className="w-48 z-10 animate-pulse"
          onError={(e) => {
            // หากหาไฟล์ไม่เจอ จะไม่แสดงรูปเสีย
            e.currentTarget.style.display = 'none';
          }}
        />
      </div>
    </div>
  );
};

export default SummonPage;