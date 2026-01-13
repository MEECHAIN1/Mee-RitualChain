import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from "vite-tsconfig-paths";
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig(({ mode }) => {
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
      strictPort: true,
    },
    preview: {
      host: true,
      port: 5000,
      strictPort: true,
    },
    optimizeDeps: {
      esbuildOptions: { // แก้ไข: เติม 's' หลัง Option
        define: {
          global: 'globalThis'
        }
      },
      // เพิ่ม Library สำคัญที่ต้องทำ Pre-bundle เพื่อป้องกันหน้าขาว/จอดำ
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
      'process.env': env, // ช่วยให้ Library เก่าๆ ที่เรียก process.env ไม่พัง
      'import.meta.env.NODE_ENV': JSON.stringify(mode),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      }
    },
    build: {
      target: 'esnext', // รองรับ BigInt (สำคัญมากสำหรับ Web3)
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (id.includes('node_modules')) {
              if (id.includes('@rainbow-me') || id.includes('wagmi') || id.includes('viem')) {
                return 'wallet-provider';
              }
              return 'vendor';
            }
          }
        }
      }
    }
  }
})