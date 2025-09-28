import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    strictPort: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@order-app/lib': path.resolve(__dirname, '../../packages/lib/src'),
      '@coffee-menu': path.resolve(__dirname, './src/coffee-menu'),
    },
  },
})
