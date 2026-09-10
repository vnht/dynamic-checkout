import type { IncomingMessage, ServerResponse } from 'node:http';
import type { Connect, Plugin } from 'vite';
import {
  clearGateCookie,
  cookieToken,
  gateCookie,
  isUnlockedFromCookie,
  requirePassword,
  safeEqual,
} from './gateAuth.ts';

function readBody(req: IncomingMessage) {
  return new Promise<string>((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

function json(res: ServerResponse, status: number, body: unknown) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

function createMiddleware(password: string): Connect.NextHandleFunction {
  const token = cookieToken(password);

  return async (req, res, next) => {
    const url = req.url?.split('?')[0] ?? '';

    if (url === '/api/auth/session' && req.method === 'GET') {
      json(res, 200, { unlocked: isUnlockedFromCookie(req.headers.cookie, token) });
      return;
    }

    if (url === '/api/auth/login' && req.method === 'POST') {
      let submitted = '';
      try {
        const raw = await readBody(req);
        submitted = String(JSON.parse(raw).password ?? '');
      } catch {
        submitted = '';
      }

      if (!safeEqual(submitted, password)) {
        json(res, 401, { error: 'invalid' });
        return;
      }

      res.setHeader('Set-Cookie', gateCookie(token));
      json(res, 200, { unlocked: true });
      return;
    }

    if (url === '/api/auth/logout' && req.method === 'POST') {
      res.setHeader('Set-Cookie', clearGateCookie());
      json(res, 200, { unlocked: false });
      return;
    }

    next();
  };
}

export function demoGatePlugin(password: string | undefined): Plugin {
  return {
    name: 'demo-gate',
    configureServer(server) {
      server.middlewares.use(createMiddleware(requirePassword(password)));
    },
    configurePreviewServer(server) {
      server.middlewares.use(createMiddleware(requirePassword(password)));
    },
  };
}
