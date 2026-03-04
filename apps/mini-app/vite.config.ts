import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import zmp from 'vite-plugin-zmp'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    zmp()
  ],
  server: {
    host: true,
    port: 3000
  },
  build: {
    target: 'es2015',
    cssCodeSplit: false
  }
})