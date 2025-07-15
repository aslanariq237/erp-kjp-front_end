import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  server: {
    cors: {
      origin : "http://127.0.0.1:8000/api/",
      methods: ["GET", "POST"],
      allowedHeaders: ["Content-type", "Authorization"],
      preflightContinue: true,
    },    
    allowedHosts : ['erpkjp.com']
  },
  plugins: [
    vue(),
    vueJsx(),    
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
