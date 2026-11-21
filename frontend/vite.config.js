import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// React JSX transform and Fast Refresh
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // 브라우저에서 /api 로 보낸 요청을 Spring Boot 서버(8080)로 대신 전달한다
      '/api': 'http://localhost:8080',
    },
  },
});