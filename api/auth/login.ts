import { gateCookie, gateFromEnv, json, safeEqual } from '../_lib/gate';

export async function POST(request: Request) {
  let submitted = '';
  try {
    const body = (await request.json()) as { password?: string };
    submitted = String(body.password ?? '');
  } catch {
    submitted = '';
  }

  try {
    const { password, token } = gateFromEnv();
    if (!safeEqual(submitted, password)) {
      return json(401, { error: 'invalid' });
    }
    return json(200, { unlocked: true }, gateCookie(token));
  } catch {
    return json(500, { error: 'unconfigured' });
  }
}
