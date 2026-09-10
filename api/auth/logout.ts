import { clearGateCookie } from '../../server/gateAuth';

type VercelReq = { method?: string };
type VercelRes = {
  setHeader: (name: string, value: string) => void;
  status: (code: number) => VercelRes;
  json: (body: unknown) => void;
};

export default function handler(req: VercelReq, res: VercelRes) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method' });
    return;
  }

  res.setHeader('Set-Cookie', clearGateCookie());
  res.status(200).json({ unlocked: false });
}
