import { Hono } from "hono";
import { reactRenderer } from '@hono/react-renderer';
import react from '@vitejs/plugin-react';
import { createServer as createViteServer } from 'vite'
import { raw } from "hono/html";


// declare module 'hono' {
//     interface ContextRenderer {
//         (children: React.ReactElement, props?: {}): Response | Promise<Response>;
//     }
// }

// declare module '@hono/react-renderer' {
//   interface Props {
//     title: string
//   }
// }

const app = new Hono();

const api = app
  .basePath('/api')
  .get('/', (c) => c.text('ok'));

app.get('*', reactRenderer(({ children }) => (
  <html>
    <head>
    <meta charSet='UTF-8' />
    <meta name='viewport' content='width=device-width, initial-scale=1.0' />
    {/* <Script />
    <Link href='/src/style.css' rel='stylesheet' /> */}
    </head>
    <body>{children}</body>
    <script type="module" src="/src/server/refresh.js" />

    <script type='module' src="/src/client/index.tsx" />
  </html>
)))

app.get('/', async (c) => {
  const viteServer = await createViteServer({ server: { middlewareMode: true }, })
  const html = await viteServer.transformIndexHtml(c.req.url, raw(<div id="root"></div>))

  return c.render(
    <div id="root"></div>
  );
});

export default app;