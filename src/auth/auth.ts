import { D1Adapter } from '@lucia-auth/adapter-sqlite';
import { Google } from 'arctic';
import type { MiddlewareHandler } from 'hono';
import type { Context } from 'hono';
import { Lucia } from 'lucia';
import { throwExpression } from 'src/utils/throwError';

interface ExtendedContext extends Context {
  google: Google;
}

export function initGoogleOAuth(c: Context) {
  const clientId =
    c.env.GOOGLE_CLIENT_ID ?? throwExpression('GOOGLE_CLIENT_ID is required');
  const clientSecret =
    c.env.GOOGLE_CLIENT_SECRET ??
    throwExpression('GOOGLE_CLIENT_SECRET is required');
  const redirectUri =
    c.env.GOOGLE_REDIRECT_URI ??
    throwExpression('GOOGLE_REDIRECT_URI is required');

  return new Google(clientId, clientSecret, redirectUri);
}

export function initializeLucia(D1: D1Database) {
  const adapter = new D1Adapter(D1, {
    user: 'user',
    session: 'session',
  });
  return new Lucia(adapter, {
    sessionCookie: {
      attributes: {
        // set to `true` when using HTTPS
        secure: process.env.NODE_ENV === 'production',
      },
    },
  });
}

declare module 'lucia' {
  interface Register {
    Auth: ReturnType<typeof initializeLucia>;
  }
}
