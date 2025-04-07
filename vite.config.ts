import { defineConfig } from 'vite';
import build from '@hono/vite-build/bun';
import devServer from '@hono/vite-dev-server';
import bunAdapter from '@hono/vite-dev-server/bun';
import react from '@vitejs/plugin-react';
import ssrHotReload from 'vite-plugin-ssr-hot-reload';

export default defineConfig({
  plugins: [
    {
      name: 'hono-vite-react-stack',
      config: (_, env) => {
        if (env.command === 'build' && !env.isSsrBuild) {
          return {
            esbuild: {
              exclude: ['react', 'react-dom'],
            },
            build: {
              manifest: true,
              rollupOptions: {
                input: ['src/client/index.tsx', 'src/style.css'],
              },
            },
          }
        }
        if (env.command === 'build' && env.isSsrBuild) {
          return {
            resolve: {
              alias: {
                'react-dom/server': 'react-dom/server.edge',
              },
            },
          }
        }
      },
    },
    devServer({
      adapter: bunAdapter,
      entry: 'src/server/index.tsx', // The file path of your application.
    }),
    react(),
    ssrHotReload({
      entry: ['src/server/*'],
      injectReactRefresh: true,
    }),
    // build(),
  ],
});