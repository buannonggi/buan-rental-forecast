// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// 레포명이 'buan'이면 아래처럼 설정
export default defineConfig({
  base: '/buan-rental-forecast/',
  plugins: [react()],
  build: { outDir: 'dist', sourcemap: true },
});
