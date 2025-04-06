import { defineConfig } from 'vite';
import build from '@hono/vite-build/bun';
import devServer from '@hono/vite-dev-server';
import bunAdapter from '@hono/vite-dev-server/bun';
import react from '@vitejs/plugin-react';
import ssrHotReload from 'vite-plugin-ssr-hot-reload';

export default defineConfig({
  ssr: {
    external: ['react', 'react-dom'], // <== add
  },
  plugins: [
    devServer({
      adapter: bunAdapter,
      entry: 'src/server/index.tsx', // The file path of your application.
    }),
    react(),
    
    // ssrHotReload({
    //   entry: ['src/server/*'],
    //   injectReactRefresh: true,
    // }),
    // build(),
  ],
});