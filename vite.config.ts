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
      port: 5000, // เปลี่ยนให้ตรงกับที่ Replit คาดหวัง
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
      minify: 'esbuild',
      sourcemap: true,
      chunkSizeWarningLimit: 5000,
      reportCompressedSize: false,
      rollupOptions: {
        output: {
          experimentalMinChunkSize: 5000,
          manualChunks: (id) => {
            if (id.includes('node_modules')) {
              return 'vendor';
            }
          }
        }
      }
    }
  };
});