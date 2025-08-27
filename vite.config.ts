import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // 使用相对路径，更适合生产环境部署
  resolve: {
    alias: {
      "@": new URL('./src', import.meta.url).pathname,
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false, // 生产环境关闭sourcemap
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          forms: ['react-hook-form', '@hookform/resolvers', 'zod'],
          utils: ['lucide-react', 'clsx', 'tailwind-merge']
        }
      }
    }
  },
  server: {
    port: 5173,
    open: true
  }
})