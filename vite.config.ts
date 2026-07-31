import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

export default defineConfig({
  plugins: [svelte()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        join: resolve(import.meta.dirname, 'join.html'),
      },
    },
  },
  server: {
    proxy: {
      '/ws': {
        target: 'ws://localhost:8787',
        ws: true,
        // Without these, a backend restart crashes the dev server via unhandled
        // proxy errors — both the proxy itself and the upgraded WS socket.
        configure: (proxy) => {
          proxy.on('error', () => {})
          proxy.on('proxyReqWs', (_proxyReq, _req, socket) => {
            socket.on('error', () => {})
          })
        },
      },
      '/api': {
        target: 'http://localhost:8787',
        configure: (proxy) => {
          proxy.on('error', () => {})
        },
      },
    },
  },
})
