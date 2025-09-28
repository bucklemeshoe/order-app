import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig(() => {
  // Vanilla mobile app with simplified configuration
  const alias: Record<string, string> = {
    '@order-app/lib': path.resolve(__dirname, '../../packages/lib/src'),
    '@order-app/core-theme': path.resolve(__dirname, '../../packages/core-theme'),
    '@order-app/core-ui': path.resolve(__dirname, '../../packages/core-ui/src'),
    '@order-app/core-lib': path.resolve(__dirname, '../../packages/core-lib/src'),
  }
  return {
    plugins: [react()],
    resolve: { alias },
  }
})
