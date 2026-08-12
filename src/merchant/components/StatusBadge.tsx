import type { ProgramStatus } from '../types';

const MAP: Record<ProgramStatus, { label: string; tone: string }> = {
  opportunity: { label: 'Opportunity', tone: 'mp-badge--warn' },
  charter_pending: { label: 'Charter pending', tone: 'mp-badge--warn' },
  observation: { label: 'Observation', tone: '' },
  evidence_review: { label: 'Evidence ready', tone: 'mp-badge--ok' },
  live_adaptive: { label: 'Live adaptive', tone: 'mp-badge--live' },
  paused: { label: 'Paused', tone: 'mp-badge--danger' },
  complete: { label: 'Complete', tone: 'mp-badge--ok' },
};

export function StatusBadge({ status, label }: { status: ProgramStatus; label?: string }) {
  const meta = MAP[status];
  return <span className={`mp-badge ${meta.tone}`}>{label ?? meta.label}</span>;
}
