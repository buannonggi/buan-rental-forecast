// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages 배포용: https://buannonggi.github.io/buan-rental-forecast/
export default defineConfig({
  plugins: [react()],
  // ⚠️ 반드시 레포지토리명으로 설정
  base: '/buan-rental-forecast/',
  server: {
    port: 5173,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    target: 'es2018',
  },
})
