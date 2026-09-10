export const config = {
  matcher: ['/api/auth/session', '/api/auth/login', '/api/auth/logout'],
};

const GATE_COOKIE = 'dcal_gate';
const GATE_MAX_AGE = 60 * 60 * 24 * 14;

function json(status: number, body: unknown, setCookie?: string) {
  const headers = new Headers({
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store',
  });
  if (setCookie) headers.set('Set-Cookie', setCookie);
  return new Response(JSON.stringify(body), { status, headers });
}

function envPassword() {
  return String(process.env.DEMO_PASSWORD ?? '').trim();
}

function safeEqual(left: string, right: string) {
  if (left.length !== right.length) return false;
  let diff = 0;
  for (let i = 0; i < left.length; i += 1) {
    diff |= left.charCodeAt(i) ^ right.charCodeAt(i);
  }
  return diff === 0;
}

function parseCookies(header: string | null) {
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

async function cookieToken(secret: string) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode('dcal-unlocked'),
  );
  return [...new Uint8Array(sig)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

function gateCookie(token: string) {
  const secure = process.env.VERCEL === '1' ? '; Secure' : '';
  return `${GATE_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${GATE_MAX_AGE}${secure}`;
}

function clearGateCookie() {
  const secure = process.env.VERCEL === '1' ? '; Secure' : '';
  return `${GATE_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure}`;
}

async function submittedPassword(request: Request) {
  try {
    const body = (await request.json()) as { password?: string };
    return String(body.password ?? '').trim();
  } catch {
    return '';
  }
}

export default async function middleware(request: Request) {
  const path = new URL(request.url).pathname;
  const password = envPassword();

  if (path === '/api/auth/session' && request.method === 'GET') {
    if (!password) return json(500, { error: 'unconfigured' });
    const token = await cookieToken(password);
    const got = parseCookies(request.headers.get('cookie'))[GATE_COOKIE];
    return json(200, { unlocked: Boolean(got && safeEqual(got, token)) });
  }

  if (path === '/api/auth/login' && request.method === 'POST') {
    if (!password) return json(500, { error: 'unconfigured' });
    const submitted = await submittedPassword(request);
    if (!safeEqual(submitted, password)) return json(401, { error: 'invalid' });
    return json(200, { unlocked: true }, gateCookie(await cookieToken(password)));
  }

  if (path === '/api/auth/logout' && request.method === 'POST') {
    return json(200, { unlocked: false }, clearGateCookie());
  }

  return json(405, { error: 'method' });
}
