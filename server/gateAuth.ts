import { createHmac, timingSafeEqual } from 'node:crypto';

export const GATE_COOKIE = 'dcal_gate';
export const GATE_MAX_AGE = 60 * 60 * 24 * 14;

export function cookieToken(secret: string) {
  return createHmac('sha256', secret).update('dcal-unlocked').digest('hex');
}

export function safeEqual(left: string, right: string) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function parseCookies(header?: string | null) {
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

export function isUnlockedFromCookie(header: string | null | undefined, token: string) {
  const got = parseCookies(header)[GATE_COOKIE];
  return Boolean(got && safeEqual(got, token));
}

export function gateCookie(token: string, maxAge = GATE_MAX_AGE) {
  const secure = process.env.VERCEL === '1' ? '; Secure' : '';
  return `${GATE_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secure}`;
}

export function clearGateCookie() {
  const secure = process.env.VERCEL === '1' ? '; Secure' : '';
  return `${GATE_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure}`;
}

export function envPassword() {
  return String(process.env.DEMO_PASSWORD ?? '').trim();
}

export function requirePassword(password: string | undefined) {
  const value = password?.trim();
  if (!value) {
    throw new Error('DEMO_PASSWORD is not set. Add it to .env locally or as a Vercel environment variable.');
  }
  return value;
}
