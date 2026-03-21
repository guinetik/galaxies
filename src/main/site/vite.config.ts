import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('aladin-lite')) return 'aladin-lite'
            if (id.includes('three')) return 'three'
            if (id.includes('vue') || id.includes('vue-router') || id.includes('vue-i18n')) return 'vue-vendor'
            if (id.includes('d3')) return 'd3'
            if (id.includes('sql.js')) return 'sqljs'
          }
        },
      },
    },
    chunkSizeWarningLimit: 500,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
    port: 9965
  },
  test: {
    include: ['src/**/*.test.ts'],
  },
})
