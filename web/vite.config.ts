import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    // Same-origin in dev, so the Express server's CORS list doesn't come into play.
    proxy: { '/api': { target: 'http://localhost:3001', changeOrigin: true } },
  },
});
