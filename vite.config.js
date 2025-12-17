import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/',    // Ensures correct root path for assets
  plugins: [react()]
})
