import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

function resolveBackendUrl() {
  const root = __dirname

  if (process.env.VITE_BACKEND_URL) {
    return process.env.VITE_BACKEND_URL
  }

  const devEnv = path.join(root, '.env.development.local')
  if (fs.existsSync(devEnv)) {
    const match = fs.readFileSync(devEnv, 'utf-8').match(/VITE_BACKEND_URL=(.+)/)
    if (match) return match[1].trim()
  }

  const portFile = path.join(root, 'backend', '.port')
  if (fs.existsSync(portFile)) {
    const port = fs.readFileSync(portFile, 'utf-8').trim()
    if (port) return `http://127.0.0.1:${port}`
  }

  return 'http://127.0.0.1:8000'
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const backendUrl = env.VITE_BACKEND_URL || resolveBackendUrl()

  console.log(`[vite] API proxy → ${backendUrl}`)

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: backendUrl,
          changeOrigin: true,
          secure: false,
          rewrite: (p) => p.replace(/^\/api/, ''),
        },
      },
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
    },
  }
})
