import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// React JSX transform and Fast Refresh
export default defineConfig({
  plugins: [react()],
});
