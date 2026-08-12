export type MerchantRole = 'growth_manager' | 'merchant_owner';

export type ProgramStatus =
  | 'opportunity'
  | 'charter_pending'
  | 'observation'
  | 'evidence_review'
  | 'live_adaptive'
  | 'paused'
  | 'complete';

export type DemoPhase =
  | 'opportunity_found'
  | 'charter_review'
  | 'observation'
  | 'evidence_gate_passed'
  | 'live_adaptive'
  | 'safety_pause'
  | 'window_complete'
  | 'second_window_complete';

export type ExperimentArm = 'control' | 'fixed' | 'adaptive';

export type SegmentId = 'high_intent_repeat' | 'cart_abandon_recover' | 'value_seekers';

export interface MerchantCharter {
  id: string;
  goal: string;
  /** Instant cashback rate shown to eligible shoppers (e.g. 0.05 = 5%). */
  rewardRatePercent: number;
  windowDays: number;
  budgetAud: number;
  experimentSplit: Record<ExperimentArm, number>;
  safetyLimits: {
    maxDailyOffers: number;
    maxRewardAud: number;
    stopLossAud: number;
  };
  locked: boolean;
  approvedByOwner: boolean;
  approvedAt: string | null;
}

export interface InsightStat {
  id: string;
  label: string;
  value: string;
  detail: string;
}

export interface ProgramInsight {
  headline: string;
  summary: string;
  recommendation: string;
  stats: InsightStat[];
  eligibilityRules: { id: string; label: string; required: boolean }[];
  totalBuyers30d: number;
  eligibleSharePct: number;
  ineligibleSharePct: number;
}

export interface AllocationDecision {
  id: string;
  date: string;
  armShares: Record<ExperimentArm, number>;
  rationale: string[];
  mode: 'observation' | 'live';
  provisional: boolean;
}

export interface LiabilityLedger {
  authorised: number;
  reserved: number;
  netConsumed: number;
  available: number;
}

export interface ReadinessItem {
  id: string;
  label: string;
  detail: string;
  status: 'pass' | 'fail' | 'warn';
}

export interface AudienceSegment {
  id: SegmentId;
  name: string;
  size: number;
  qualified: number;
  avgFirstOrderAud: number;
  description: string;
}

export interface QualificationExample {
  name: string;
  firstOrderAud: number;
  daysSincePurchase: number;
  emailConsent: boolean;
  paymentSettled: boolean;
  reasons: string[];
  qualified: boolean;
}

export interface EvidenceGateRow {
  id: string;
  criterion: string;
  threshold: string;
  actual: string;
  passed: boolean;
}

export interface SafetyMetric {
  id: string;
  label: string;
  limit: string;
  current: string;
  status: 'ok' | 'breach' | 'warn';
}

export interface ArmResult {
  arm: ExperimentArm;
  offers: number;
  redemptions: number;
  secondPurchaseRate: number;
  incrementalRevenueAud: number;
  costAud: number;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  detail: string;
}

export interface ProgramMetrics {
  eligibleSettled: number;
  offersSent: number;
  redemptions: number;
  liabilityAvailable: number;
  secondPurchaseLiftPp: number | null;
}

export interface AgenticGrowthFixture {
  phase: DemoPhase;
  status: ProgramStatus;
  statusLabel: string;
  metrics: ProgramMetrics;
  readiness: ReadinessItem[];
  charter: MerchantCharter;
  insight: ProgramInsight;
  segments: AudienceSegment[];
  qualificationExample: QualificationExample;
  ineligibleExample: QualificationExample;
  allocation: AllocationDecision;
  hypotheticalAllocation: AllocationDecision;
  ledger: LiabilityLedger;
  evidenceGate: EvidenceGateRow[];
  evidencePassed: boolean;
  liveApproved: boolean;
  safety: SafetyMetric[];
  merchantStop: boolean;
  helloCleverStop: boolean;
  pauseReason: string | null;
  armResults: ArmResult[];
  learningNotes: string[];
  audit: AuditEvent[];
  weeklyObservationSummary: string;
  timeline: { label: string; done: boolean }[];
  flowStage: 'insight' | 'setup' | 'run' | 'track';
}

export interface SimFlags {
  evidenceFail: boolean;
  budgetExhausted: boolean;
  missingConsent: boolean;
  deliveryFailure: boolean;
  ledgerBreach: boolean;
  explanationUnavailable: boolean;
  lateReversal: boolean;
}
