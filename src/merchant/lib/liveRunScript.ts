export interface LiveRunEvent {
  id: string;
  atMs: number;
  kind: 'qualify' | 'skip' | 'offer' | 'redeem' | 'allocate' | 'liability' | 'warn' | 'complete';
  title: string;
  detail: string;
  delta?: {
    offers?: number;
    redemptions?: number;
    reserved?: number;
    consumed?: number;
    adaptiveShare?: number;
  };
}

/** Scripted live Instant cashback run (~45s if played in full). */
export const LIVE_RUN_EVENTS: LiveRunEvent[] = [
  {
    id: 'lr-1',
    atMs: 0,
    kind: 'allocate',
    title: 'Live adaptive unlocked',
    detail: 'Starting at charter mix 20 / 40 / 40. Eligibility gates armed.',
  },
  {
    id: 'lr-2',
    atMs: 1800,
    kind: 'qualify',
    title: 'Qualified · Mia Chen',
    detail: 'Settled A$678 · consent on file → Instant cashback A$33.90 reserved.',
    delta: { offers: 1, reserved: 33.9 },
  },
  {
    id: 'lr-3',
    atMs: 3200,
    kind: 'skip',
    title: 'Skipped · Alex Nguyen',
    detail: 'Settled payment but no promotional consent. Standard checkout only.',
  },
  {
    id: 'lr-4',
    atMs: 4800,
    kind: 'offer',
    title: 'Batch send · high-intent segment',
    detail: '42 Instant cashback offers via Hello Clever email (eligible only).',
    delta: { offers: 42, reserved: 620 },
  },
  {
    id: 'lr-5',
    atMs: 7000,
    kind: 'redeem',
    title: 'Redemption · accessory attach',
    detail: 'Jordan redeemed A$14.90 Instant cashback on a case + cable order.',
    delta: { redemptions: 1, consumed: 14.9, reserved: -14.9 },
  },
  {
    id: 'lr-6',
    atMs: 9000,
    kind: 'allocate',
    title: 'I nudged adaptive +4pp',
    detail: 'Fixed underperforming on redemptions. New mix 20 / 36 / 44. Floor intact.',
    delta: { adaptiveShare: 44 },
  },
  {
    id: 'lr-7',
    atMs: 11200,
    kind: 'skip',
    title: 'Skipped · corporate guest',
    detail: 'Pending settlement. No Instant cashback until funds clear.',
  },
  {
    id: 'lr-8',
    atMs: 13000,
    kind: 'offer',
    title: 'Batch send · value seekers',
    detail: '28 offers · avg reward A$9.90. Ineligible cohort untouched.',
    delta: { offers: 28, reserved: 277 },
  },
  {
    id: 'lr-9',
    atMs: 15500,
    kind: 'redeem',
    title: 'Redemption burst',
    detail: '6 second purchases landed in the last hour.',
    delta: { redemptions: 6, consumed: 78, reserved: -78 },
  },
  {
    id: 'lr-10',
    atMs: 18000,
    kind: 'liability',
    title: 'Ledger reconciled',
    detail: 'reserved + netConsumed + available = authorised. All balanced.',
  },
  {
    id: 'lr-11',
    atMs: 20500,
    kind: 'allocate',
    title: 'Adaptive share → 48%',
    detail: 'Daily move within 10pp. Control held for measurement.',
    delta: { adaptiveShare: 48 },
  },
  {
    id: 'lr-12',
    atMs: 23000,
    kind: 'qualify',
    title: 'Qualified · Sam Okonkwo',
    detail: 'PayID settled · Instant cashback A$33.90 unlocked on recommended rail.',
    delta: { offers: 1, reserved: 33.9 },
  },
  {
    id: 'lr-13',
    atMs: 25500,
    kind: 'offer',
    title: 'Afternoon send complete',
    detail: '+61 offers. Daily cap headroom remaining.',
    delta: { offers: 61, reserved: 890 },
  },
  {
    id: 'lr-14',
    atMs: 28000,
    kind: 'redeem',
    title: 'Redemptions climbing',
    detail: 'Adaptive arm leading fixed by +1.8pp second-purchase rate.',
    delta: { redemptions: 11, consumed: 142, reserved: -120 },
  },
  {
    id: 'lr-15',
    atMs: 31000,
    kind: 'warn',
    title: 'Watching stop-loss',
    detail: 'Consumed rising but still under A$3,500 stop-loss. No pause needed.',
  },
  {
    id: 'lr-16',
    atMs: 34000,
    kind: 'liability',
    title: 'Mid-window health check',
    detail: 'Eligibility still ~38%. Ineligible buyers never entered the ledger.',
  },
  {
    id: 'lr-17',
    atMs: 37000,
    kind: 'redeem',
    title: 'Evening redemptions',
    detail: 'Another 9 Instant cashback redemptions settled.',
    delta: { redemptions: 9, consumed: 118, reserved: -90 },
  },
  {
    id: 'lr-18',
    atMs: 40000,
    kind: 'complete',
    title: 'Window pace looks healthy',
    detail: 'I can close window one reporting whenever you’re ready.',
  },
];

export interface LiveRunSnapshot {
  offersSent: number;
  redemptions: number;
  reserved: number;
  consumed: number;
  available: number;
  authorised: number;
  adaptiveShare: number;
  fixedShare: number;
  controlShare: number;
}

export function initialLiveSnapshot(): LiveRunSnapshot {
  return {
    offersSent: 1860,
    redemptions: 214,
    reserved: 900,
    consumed: 400,
    available: 10700,
    authorised: 12000,
    adaptiveShare: 40,
    fixedShare: 40,
    controlShare: 20,
  };
}

export function applyLiveDelta(
  snap: LiveRunSnapshot,
  delta: LiveRunEvent['delta'],
): LiveRunSnapshot {
  if (!delta) return snap;
  const reserved = Math.max(0, snap.reserved + (delta.reserved ?? 0));
  const consumed = snap.consumed + (delta.consumed ?? 0);
  const authorised = snap.authorised;
  let available = authorised - reserved - consumed;
  if (available < 0) available = 0;

  const adaptiveShare = delta.adaptiveShare ?? snap.adaptiveShare;
  const controlShare = 20;
  const fixedShare = Math.max(15, 100 - controlShare - adaptiveShare);

  return {
    ...snap,
    offersSent: snap.offersSent + (delta.offers ?? 0),
    redemptions: snap.redemptions + (delta.redemptions ?? 0),
    reserved: Math.round(reserved * 10) / 10,
    consumed: Math.round(consumed * 10) / 10,
    available: Math.round(available * 10) / 10,
    adaptiveShare,
    fixedShare,
    controlShare,
  };
}
