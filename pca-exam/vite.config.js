import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base를 상대 경로로 두어 하위 경로(예: GitHub Pages)에 배포해도 동작하게 한다.
export default defineConfig({
  base: './',
  plugins: [react()],
})
