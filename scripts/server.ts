export default {
  async fetch(req: Request) {
    if (req.method === 'POST') {
      const link: { link: string } = await req.json();

      const foo = await fetch(link.link);
      const bar = await foo.text();

      const res = new Response(bar, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*', // Allow requests from all origins
          'Access-Control-Allow-Methods': 'POST', // Specify allowed methods
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
  },
};
