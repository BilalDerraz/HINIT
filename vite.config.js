import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // Split the dependencies that never change from the copy and layout that
    // does. A copy tweak then re-downloads a few kB instead of the whole
    // bundle, and returning visitors keep React and the icons from cache.
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          if (id.includes('lucide-react')) return 'icons';
          return 'react';
        },
      },
    },
  },
});
