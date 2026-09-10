import { cookieToken, envPassword, isUnlockedFromCookie } from '../../server/gateAuth';

type VercelReq = { method?: string; headers: { cookie?: string } };
type VercelRes = {
  setHeader: (name: string, value: string) => void;
  status: (code: number) => VercelRes;
  json: (body: unknown) => void;
};

export default function handler(req: VercelReq, res: VercelRes) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'method' });
    return;
  }

  const password = envPassword();
  if (!password) {
    res.status(500).json({ error: 'unconfigured' });
    return;
  }

  res.status(200).json({
    unlocked: isUnlockedFromCookie(req.headers.cookie, cookieToken(password)),
  });
}
