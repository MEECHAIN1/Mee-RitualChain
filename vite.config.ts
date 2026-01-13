import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from "vite-tsconfig-paths";
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [
      react(),
      tsconfigPaths(),
      nodePolyfills({
        // ครอบคลุมการใช้งาน Buffer และ Global สำหรับ Web3
        globals: { Buffer: true, global: true, process: true }
      }),
    ],
  server: {
    host: true,
    port: 3000,
    watch: {
      usePolling: true, // ช่วยให้เสถียรขึ้นบน Replit
    },
    hmr: {
      overlay: false, // ปิดการแสดง error ทับหน้าจอที่ทำให้หน้าจอค้าง
    }
  },
      include: [
        'buffer', 
        'process', 
        'react', 
        'react-dom', 
        'wagmi', 
        'viem', 
        '@rainbow-me/rainbowkit'
      ],
    },
define: {
  'process.env': {}, 
  'import.meta.env.NODE_ENV': JSON.stringify(mode),
},
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      }   
    },
   build: {
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (id.includes('node_modules')) {
              if (id.includes('@rainbow-me') || id.includes('wagmi')) {
                return 'wallet-vendor';
              }
              return 'vendor';
             }
            }
          }
        }
      }
    }
  };