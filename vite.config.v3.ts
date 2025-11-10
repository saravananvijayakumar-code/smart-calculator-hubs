import { defineConfig } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './frontend'),
      '~backend/client': path.resolve(__dirname, './frontend/client'),
      '~backend': path.resolve(__dirname, './backend'),
    },
  },
  plugins: [react()],
  root: 'frontend',
  mode: "development",
  build: {
    outDir: '../dist',
    minify: false,
  }
})
