import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/rustdesk-client-generator-app/', // 部署到 GitHub Pages 的基础路径
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
    open: false // 建议改为 false，以兼容所有开发环境（如 Docker）
  }
})
