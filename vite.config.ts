import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { demoGatePlugin } from './server/demoGate.ts'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const password = env.DEMO_PASSWORD || process.env.DEMO_PASSWORD

  return {
    plugins: [react(), demoGatePlugin(password)],
  }
})
