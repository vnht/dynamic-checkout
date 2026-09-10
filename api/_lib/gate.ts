import {
  clearGateCookie,
  cookieToken,
  gateCookie,
  isUnlockedFromCookie,
  requirePassword,
  safeEqual,
} from '../../server/gateAuth.ts';

export function json(status: number, body: unknown, setCookie?: string) {
  const headers = new Headers({
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store',
  });
  if (setCookie) headers.set('Set-Cookie', setCookie);
  return new Response(JSON.stringify(body), { status, headers });
}

export function gateFromEnv() {
  const password = requirePassword(process.env.DEMO_PASSWORD);
  return { password, token: cookieToken(password) };
}

export { clearGateCookie, gateCookie, isUnlockedFromCookie, safeEqual };
