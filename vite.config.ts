import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from "vite-tsconfig-paths";
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig(({ mode }) => {
  // บรรทัดที่ 8 ต้องเป็นแบบนี้เท่านั้น
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
      strictPort: true,
      watch: {
        usePolling: true,
      }
    },
    optimizeDeps: {
      esbuildOptions: {
        define: {
          global: 'globalThis'
        }
      },
      include: ['buffer', 'process', 'react', 'react-dom', 'wagmi', 'viem', '@rainbow-me/rainbowkit'],
    },
    define: {
      'process.env': {}, // ป้องกันปัญหาความปลอดภัยที่ Vite เตือน
      'import.meta.env.NODE_ENV': JSON.stringify(mode),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      }
    },
    build: {
      target: 'esnext',
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
  };
});