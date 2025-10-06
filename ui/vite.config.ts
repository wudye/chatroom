import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // Proxy all requests starting with /api to backend running on port 8869
      '/api': {
        target: 'http://localhost:8869',
        changeOrigin: true,
        secure: false,
        // optional: rewrite the path if your backend doesn't expect the /api prefix
        // rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
