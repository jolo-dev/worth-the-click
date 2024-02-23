export const server = Bun.serve({
  async fetch(req) {
    console.log('Fetching', req);
    if (req.method === 'POST') {
      const link: { link: string } = await req.json();
      console.log(link);

      const foo = await fetch(link.link);
      const bar = await foo.text();
      // console.log(bar);

      const res = new Response(bar, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*', // Allow requests from all origins
          'Access-Control-Allow-Methods': 'GET, POST', // Specify allowed methods
          'Access-Control-Allow-Headers': 'Content-Type', // Specify allowed headers
        },
      });
      console.log('In Server', res);

      return res;
    }
    if (req.method === 'OPTIONS') {
      console.log('Option request');
      return new Response(null, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*', // Allow requests from all origins
          'Access-Control-Allow-Methods': 'GET, POST', // Specify allowed methods
          'Access-Control-Allow-Headers': 'Content-Type', // Specify allowed headers
        },
      });
    }
    return new Response('Page not found', { status: 404 });
  },
});

console.log(`Listening on ${server.url}`);
