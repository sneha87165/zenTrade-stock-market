import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: "./",
  plugins: [react()],
  server: {
    port: 5174,
    strictPort: true,
    host: "0.0.0.0",
  },
  preview: {
    port: 5174,
    strictPort: true,
    host: "0.0.0.0",
  },
  optimizeDeps: {
    include: ["@mui/icons-material"],
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
});
