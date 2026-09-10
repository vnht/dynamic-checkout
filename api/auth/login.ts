import { cookieToken, envPassword, gateCookie, safeEqual } from '../../server/gateAuth';

type VercelReq = { method?: string; body?: unknown };
type VercelRes = {
  setHeader: (name: string, value: string) => void;
  status: (code: number) => VercelRes;
  json: (body: unknown) => void;
};

function submittedPassword(body: unknown) {
  if (typeof body === 'string') {
    try {
      return String(JSON.parse(body).password ?? '').trim();
    } catch {
      return '';
    }
  }
  if (body && typeof body === 'object' && 'password' in body) {
    return String((body as { password?: string }).password ?? '').trim();
  }
  return '';
}

export default function handler(req: VercelReq, res: VercelRes) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method' });
    return;
  }

  const password = envPassword();
  if (!password) {
    res.status(500).json({ error: 'unconfigured' });
    return;
  }

  const submitted = submittedPassword(req.body);
  if (!safeEqual(submitted, password)) {
    res.status(401).json({ error: 'invalid' });
    return;
  }

  res.setHeader('Set-Cookie', gateCookie(cookieToken(password)));
  res.status(200).json({ unlocked: true });
}
