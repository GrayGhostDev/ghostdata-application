// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import vitePluginEnvironment from '@jswork/vite-plugin-environment';


export default defineConfig({
  plugins: [
    react(),
    vitePluginEnvironment([
      'REACT_APP_THIRDWEB_CLIENT_ID',
      'REACT_APP_CONTRACT_ADDRESS',
      'REACT_APP_CHAIN_ID',
      'VITE_ALCHEMY_API_URL_MAINNET',
      'VITE_ALCHEMY_API_URL_LOCALHOST',
      'VITE_ALCHEMY_API_URL_SEPOLIA',
      'VITE_MAINNET_CONTRACT_ADDRESS',
      'VITE_MUMBAI_CONTRACT_ADDRESS',
      'VITE_LOANDISK_PUBLIC_KEY',
      'VITE_LOANDISK_BRANCH_ID',
      'VITE_LOANDISK_AUTH_CODE',
      'VITE_PRIVATE_KEY',
    ]),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // Replace with your backend's URL/port
        changeOrigin: true,
        secure: false,
      },
    },
  },
  resolve: {
    alias: {
      '@': '/src', // Optional alias for cleaner imports
    },
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
  },
  build: {
    outDir: 'build',
  },
});
