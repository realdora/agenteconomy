import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 650,
    rollupOptions: isSsrBuild ? {} : {
      output: {
        manualChunks: {
          charts: ['recharts'],
          react: ['react', 'react-dom'],
        },
      },
    },
  },
}))
