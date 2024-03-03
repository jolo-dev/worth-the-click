import { Hono } from 'hono';
import { bearerAuth } from 'hono/bearer-auth';
import { cors } from 'hono/cors';

const app = new Hono();

app.use('/', cors());
const token = 'honoiscool';

const headers = {
  'Access-Control-Allow-Origin': '*', // Allow requests from all origins
  'Access-Control-Allow-Methods': 'POST', // Specify allowed methods
  'Access-Control-Allow-Headers': 'Content-Type', // Specify allowed headers
};

app.post('/', bearerAuth({ token }), async (c) => {
  const link: { link: string } = await c.req.json();

  const foo = await fetch(link.link);
  const bar = await foo.text();

  return new Response(bar, {
    status: 200,
    headers,
  });
});

export default app;
