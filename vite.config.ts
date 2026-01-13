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
        globals: { Buffer: true, global: true, process: true }
      }),
    ],
    server: {
      host: true,
      port: 3000,
      allowedHosts: true,
    },
    // เพิ่มส่วนนี้เพื่อการ Deploy (Preview Mode)
    preview: {
      host: true,
      port: 5000,
      strictPort: true, // ป้องกันการหนีไปพอร์ตอื่น
    },
    optimizeDeps: {
      esbuildOption: {
        define: {
          global: 'globalThis'
        }
      },
      include: ['buffer', 'process', 'react', 'react-dom', 'wagmi', 'viem'],
    },
    define: {
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
        // แยก Library ของ Wallet ออกไปเป็นไฟล์ต่างหากชื่อ 'wallet-vendor'
        if (id.includes('node_modules')) {
          if (id.includes('@reown') || id.includes('@rainbow-me') || id.includes('wagmi')) {
            return 'wallet-vendor';
          }
          return 'vendor'; // Library อื่นๆ อยู่ใน vendor ปกติ
        }
      }
    }
  }
 }
}
})