import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
   server: {
    proxy: {
      '/api': 'https://kartavya-job-application-manager.onrender.com'
    }
  },
  });