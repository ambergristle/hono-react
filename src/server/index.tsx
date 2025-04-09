import { Hono } from "hono";
import { reactRenderer } from '@hono/react-renderer';
import { Script } from "./components/script";
import { Link } from "./components/link";


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

export type AppAPI = typeof api;

app.get('*', reactRenderer(({ children }) => (
  <html>
    <head>
      <meta charSet='UTF-8' />
      <meta name='viewport' content='width=device-width, initial-scale=1.0' />
      <Script />
      <Link href='/src/style.css' rel='stylesheet' />
    </head>
    <body>{children}</body>
  </html>
)))

app.get('/', async (c) => {
  return c.render(
    <div id="root"></div>
  );
});

export default app;