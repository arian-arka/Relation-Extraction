import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

export default defineConfig({
  plugins: [solidPlugin()],
  server: {
    // host:'127.0.0.1',
    // port: 4000,
    port: 3001,
  },
  build: {
    target: 'esnext',
    outDir: './dist'
  },
});
