import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 깃허브 Pages 리포지토리명
const REPO = 'buan'

export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? `/${REPO}/` : '/',
})
