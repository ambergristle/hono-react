import { defineConfig, type Plugin } from 'vite';
import build from '@hono/vite-build/bun';
import devServer from '@hono/vite-dev-server';
import bunAdapter from '@hono/vite-dev-server/bun';
import react from '@vitejs/plugin-react';
import ssrHotReload from 'vite-plugin-ssr-hot-reload';
import tailwindcss from '@tailwindcss/vite';


const devPlugins = [
  ssrHotReload({
    entry: ['src/server/*'],
    injectReactRefresh: true,
  }),
  devServer({
    adapter: bunAdapter,
    entry: 'src/server/index.tsx', // The file path of your application.
  }),
  ...react() as Plugin[]
];

devPlugins.forEach((plugin) => {
  plugin.apply = (_config, env) => env.command === 'serve';
})

const buildPlugin = build({
  entry: 'src/server/index.tsx',
  outputDir: 'dist/server'
});

buildPlugin.apply = (_config, env) => env.command === 'build' && env.isSsrBuild === true;


export default defineConfig({
  plugins: [
    {
      name: 'hono-vite-react-stack',
      config: (_, env) => {
        if (env.command === 'build' && !env.isSsrBuild) {
          console.log('redicted')
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
        // if (env.command === 'build' && env.isSsrBuild) {
        //   return {
        //     resolve: {
        //       alias: {
        //         'react-dom/server': 'react-dom/server.edge',
        //       },
        //     },
        //   }
        // }
      },
    },
    ...devPlugins,
    buildPlugin,
    tailwindcss(),
  ],
});