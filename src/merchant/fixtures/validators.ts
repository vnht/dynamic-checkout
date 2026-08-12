import type { ExperimentArm, LiabilityLedger } from '../types';

const ARMS: ExperimentArm[] = ['control', 'fixed', 'adaptive'];

export function sharesSumTo100(shares: Record<ExperimentArm, number>): boolean {
  const sum = ARMS.reduce((acc, arm) => acc + shares[arm], 0);
  return Math.abs(sum - 100) < 0.01;
}

export function sharesRespectFloor(shares: Record<ExperimentArm, number>, floor = 15): boolean {
  return ARMS.every((arm) => shares[arm] >= floor - 0.01);
}

export function dailyMoveWithinLimit(
  previous: Record<ExperimentArm, number>,
  next: Record<ExperimentArm, number>,
  maxPp = 10,
): boolean {
  return ARMS.every((arm) => Math.abs(next[arm] - previous[arm]) <= maxPp + 0.01);
}

export function liabilityBalances(ledger: LiabilityLedger): boolean {
  const sum = ledger.reserved + ledger.netConsumed + ledger.available;
  return Math.abs(sum - ledger.authorised) < 0.01;
}

export function assertAllocationValid(
  shares: Record<ExperimentArm, number>,
  previous?: Record<ExperimentArm, number>,
): string[] {
  const errors: string[] = [];
  if (!sharesSumTo100(shares)) errors.push('Adaptive shares must sum to 100%.');
  if (!sharesRespectFloor(shares)) errors.push('Each arm must keep at least a 15% floor.');
  if (previous && !dailyMoveWithinLimit(previous, shares)) {
    errors.push('Daily allocation move cannot exceed 10 percentage points per arm.');
  }
  return errors;
}
