import { Google, generateCodeVerifier, generateState } from 'arctic';
import { Hono } from 'hono';
import { bearerAuth } from 'hono/bearer-auth';
import { cors } from 'hono/cors';
import { setCookie, getCookie } from 'hono/cookie';
import { initGoogleOAuth, initializeLucia } from 'src/auth/auth';
import { throwExpression } from 'src/utils/throwError';
import { html } from 'hono/html';

type Bindings = {
  DB: D1Database;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  GOOGLE_REDIRECT_URI: string;
};

type GoogleUser = {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
  email_verified: boolean;
  locale: string;
};

const app = new Hono<{ Bindings: Bindings }>();

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

app.get('/login', async (c) => {
  const google = initGoogleOAuth(c);
  const state = generateState();
  const codeVerifier = generateCodeVerifier();
  setCookie(c, 'codeVerifier', codeVerifier);
  setCookie(c, 'state', state);

  const url = await google.createAuthorizationURL(state, codeVerifier, {
    scopes: ['profile', 'email'],
  });
  console.log(url.href);

  return c.html(`
    <html>
      <body>
        <script>
          window.open('${url}', '_blank', 'width=520, height=570');
        </script>
      </body>
    </html>
 `);
});

app.get('/auth', async (c) => {
  // const d1 = c.env.DB;
  // const auth = initializeLucia(d1);
  // const stateCookie = auth.createSessionCookie('state');
  // stateCookie.value = state;
  // console.log(stateCookie);
  const codeVerifier =
    getCookie(c, 'codeVerifier') ?? throwExpression('No codeVerifier cookie');

  const google = initGoogleOAuth(c);

  const code = new URL(c.req.url).searchParams.get('code');
  if (code !== null) {
    const tokens = await google.validateAuthorizationCode(code, codeVerifier);
    const response = await fetch(
      'https://openidconnect.googleapis.com/v1/userinfo',
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      },
    );
    const user: GoogleUser = await response.json();
    console.log(user);
    return c.html(`
      <html>
        <body>
          <h1>Hello ${user.name}</h1>
          <img src="${user.picture}" alt="${user.name}" />
        </body>
      </html>
   `);
  }
});

export default app;
