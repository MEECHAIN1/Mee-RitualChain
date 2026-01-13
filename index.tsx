import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './src/App';
import './index.css';

// ⚠️ สำคัญมาก: ต้อง import CSS ของ RainbowKit เพื่อป้องกันปุ่มซ้อน/เบี้ยว
import '@rainbow-me/rainbowkit/styles.css'; 

import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config, ritualchain } from './src/wagmi'; // นำเข้า ritualchain มาเป็นค่าเริ่มต้น

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
      staleTime: 5000,
    },
  },
});

const rootElement = document.getElementById('root');

if (rootElement) {
  createRoot(rootElement).render(
    <React.StrictMode>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider
            // ตั้งค่า Theme ให้เข้ากับสีส้มของ MeeBot
            theme={darkTheme({
              accentColor: "#ff8906",
              accentColorForeground: "#ffffff",
              borderRadius: "medium", // ปรับความโค้งปุ่มให้ดูพรีเมียม
            })}
            // บังคับให้เริ่มที่ RitualChain เพื่อลดโอกาส Error Wrong Network
            initialChain={ritualchain} 
            modalSize="compact" // ปรับขนาด Modal ให้กะทัดรัด ไม่หลุดเฟรม
          >
            <App />
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </React.StrictMode>
  );
}