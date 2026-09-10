import { gateFromEnv, isUnlockedFromCookie, json } from '../_lib/gate';

export function GET(request: Request) {
  try {
    const { token } = gateFromEnv();
    return json(200, { unlocked: isUnlockedFromCookie(request.headers.get('cookie'), token) });
  } catch {
    return json(500, { error: 'unconfigured' });
  }
}
