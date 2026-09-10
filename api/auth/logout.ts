import { clearGateCookie, json } from '../_lib/gate';

export function POST() {
  return json(200, { unlocked: false }, clearGateCookie());
}
