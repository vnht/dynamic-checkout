import { createHmac, timingSafeEqual } from 'node:crypto';
import type { Connect, Plugin } from 'vite';

const COOKIE = 'dcal_gate';
const MAX_AGE = 60 * 60 * 24 * 14;

function cookieToken(secret: string) {
  return createHmac('sha256', secret).update('dcal-unlocked').digest('hex');
}

function safeEqual(left: string, right: string) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

function parseCookies(header?: string) {
  const out: Record<string, string> = {};
  if (!header) return out;
  for (const part of header.split(';')) {
    const cut = part.indexOf('=');
    if (cut === -1) continue;
    const key = part.slice(0, cut).trim();
    const value = part.slice(cut + 1).trim();
    if (key) out[key] = decodeURIComponent(value);
  }
  return out;
}

function isUnlocked(req: Connect.IncomingMessage, token: string) {
  const got = parseCookies(req.headers.cookie)[COOKIE];
  return Boolean(got && safeEqual(got, token));
}

function readBody(req: Connect.IncomingMessage) {
  return new Promise<string>((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

function json(res: Connect.ServerResponse, status: number, body: unknown) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

export function demoGatePlugin(password: string | undefined): Plugin {
  if (!password) {
    throw new Error('DEMO_PASSWORD is not set. Add it to .env on the server.');
  }

  const token = cookieToken(password);

  const middleware: Connect.NextHandleFunction = async (req, res, next) => {
    const url = req.url?.split('?')[0] ?? '';

    if (url === '/api/auth/session' && req.method === 'GET') {
      json(res, 200, { unlocked: isUnlocked(req, token) });
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

      res.setHeader(
        'Set-Cookie',
        `${COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${MAX_AGE}`,
      );
      json(res, 200, { unlocked: true });
      return;
    }

    if (url === '/api/auth/logout' && req.method === 'POST') {
      res.setHeader('Set-Cookie', `${COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`);
      json(res, 200, { unlocked: false });
      return;
    }

    next();
  };

  return {
    name: 'demo-gate',
    configureServer(server) {
      server.middlewares.use(middleware);
    },
    configurePreviewServer(server) {
      server.middlewares.use(middleware);
    },
  };
}
