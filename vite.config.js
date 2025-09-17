import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwind from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwind()],
    test: {
        environment: 'jsdom',                 // 브라우저 DOM 환경
        setupFiles: './src/test/setupTests.js', // RTL 확장 등 사전세팅 파일
        globals: true,                        // describe/it/expect 전역 사용
        css: true,                            // CSS 모듈/일반 CSS import 허용
        include: ['src/**/*.{test,spec}.jsx'],// 테스트 파일 탐색 패턴
        coverage: {
            reporter: ['text', 'html'],
            reportsDirectory: './coverage',
        },
    },
})
