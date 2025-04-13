import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './client/src'),
      '@components': path.resolve(__dirname, './client/src/components'),
      '@pages': path.resolve(__dirname, './client/src/pages'),
      '@lib': path.resolve(__dirname, './client/src/lib'),
      '@hooks': path.resolve(__dirname, './client/src/hooks'),
      '@assets': path.resolve(__dirname, './client/public/assets'),
      '@shared': path.resolve(__dirname, './shared'),
    },
  },
  preview: {
    host: true,
    port: 3000,
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: false,
    cors: {
      origin: '*',
    },
    hmr: {
      clientPort: 443,
      host: '5a6bca4a-2b7c-4dbe-adbb-6c6324cb6c03-00-24h17hqacvzwc.spock.replit.dev',
    },
    fs: {
      // Allow serving files from one level up (to the project root)
      allow: ['..'],
    },
    proxy: {
      '/v2/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'client/index.html'),
      },
    },
  },
});