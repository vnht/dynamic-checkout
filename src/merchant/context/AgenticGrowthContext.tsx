import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { STORAGE_KEYS } from '../../lib/constants';
import { buildFixture, DEMO_PHASES, PHASE_STORAGE_KEY, ROLE_STORAGE_KEY } from '../fixtures/phases';
import type {
  AgenticGrowthFixture,
  AuditEvent,
  DemoPhase,
  MerchantRole,
  SimFlags,
} from '../types';

interface AgenticGrowthContextValue {
  role: MerchantRole;
  setRole: (role: MerchantRole) => void;
  phase: DemoPhase;
  setPhase: (phase: DemoPhase) => void;
  fixture: AgenticGrowthFixture;
  sim: SimFlags;
  setSimFlag: <K extends keyof SimFlags>(key: K, value: SimFlags[K]) => void;
  simDrawerOpen: boolean;
  setSimDrawerOpen: (open: boolean) => void;
  selectedDecisionId: string | null;
  setSelectedDecisionId: (id: string | null) => void;
  qualificationOpen: boolean;
  setQualificationOpen: (open: boolean) => void;
  messagePreviewOpen: boolean;
  setMessagePreviewOpen: (open: boolean) => void;
  liveApprovalOpen: boolean;
  setLiveApprovalOpen: (open: boolean) => void;
  isOwner: boolean;
  canApproveCharter: boolean;
  canApproveLive: boolean;
  canStopOffers: boolean;
  approveCharter: () => void;
  approveLive: () => void;
  stopNewOffers: (by: 'merchant' | 'hello_clever') => void;
  resumeOffers: () => void;
  replayTodayDecision: () => void;
  resetDemo: () => void;
  appendAudit: (event: Omit<AuditEvent, 'id' | 'timestamp'> & { id?: string }) => void;
  handoff: Record<string, unknown> | null;
  emitSimEvent: (name: string, detail?: string) => void;
  phases: typeof DEMO_PHASES;
}

const DEFAULT_SIM: SimFlags = {
  evidenceFail: false,
  budgetExhausted: false,
  missingConsent: false,
  deliveryFailure: false,
  ledgerBreach: false,
  explanationUnavailable: false,
  lateReversal: false,
};

function loadPhase(): DemoPhase {
  const raw = localStorage.getItem(PHASE_STORAGE_KEY);
  const match = DEMO_PHASES.find((p) => p.id === raw);
  return match?.id ?? 'opportunity_found';
}

function loadRole(): MerchantRole {
  const raw = localStorage.getItem(ROLE_STORAGE_KEY);
  return raw === 'merchant_owner' ? 'merchant_owner' : 'growth_manager';
}

function loadHandoff(): Record<string, unknown> | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.agenticGrowthHandoff);
    return raw ? (JSON.parse(raw) as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

const AgenticGrowthContext = createContext<AgenticGrowthContextValue | null>(null);

export function AgenticGrowthProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<MerchantRole>(() => loadRole());
  const [phase, setPhaseState] = useState<DemoPhase>(() => loadPhase());
  const [sim, setSim] = useState<SimFlags>(DEFAULT_SIM);
  const [simDrawerOpen, setSimDrawerOpen] = useState(false);
  const [selectedDecisionId, setSelectedDecisionId] = useState<string | null>(null);
  const [qualificationOpen, setQualificationOpen] = useState(false);
  const [messagePreviewOpen, setMessagePreviewOpen] = useState(false);
  const [liveApprovalOpen, setLiveApprovalOpen] = useState(false);
  const [localAudit, setLocalAudit] = useState<AuditEvent[]>([]);
  const [overrides, setOverrides] = useState<Partial<AgenticGrowthFixture>>({});
  const [handoff] = useState(() => loadHandoff());

  const base = useMemo(() => buildFixture(phase), [phase]);

  const fixture = useMemo(() => {
    let next: AgenticGrowthFixture = {
      ...base,
      ...overrides,
      audit: [...base.audit, ...(overrides.audit ?? []), ...localAudit],
    };

    if (sim.evidenceFail) {
      next = {
        ...next,
        evidencePassed: false,
        evidenceGate: next.evidenceGate.map((row) =>
          row.id === 'n' ? { ...row, actual: '920', passed: false } : row,
        ),
      };
    }
    if (sim.budgetExhausted) {
      next = {
        ...next,
        ledger: { authorised: 12000, reserved: 0, netConsumed: 12000, available: 0 },
        metrics: { ...next.metrics, liabilityAvailable: 0 },
      };
    }
    if (sim.missingConsent) {
      next = {
        ...next,
        readiness: next.readiness.map((r) =>
          r.id === 'consent' ? { ...r, status: 'fail', detail: 'Consent coverage below threshold.' } : r,
        ),
        qualificationExample: {
          ...next.qualificationExample,
          emailConsent: false,
          qualified: false,
          reasons: ['Missing promotional email consent'],
        },
      };
    }
    if (sim.deliveryFailure) {
      next = {
        ...next,
        evidenceGate: next.evidenceGate.map((row) =>
          row.id === 'delivery' ? { ...row, actual: '91.2%', passed: false } : row,
        ),
        evidencePassed: false,
      };
    }
    if (sim.ledgerBreach) {
      next = {
        ...next,
        ledger: { authorised: 12000, reserved: 2500, netConsumed: 9000, available: 1200 },
        safety: next.safety.map((s) =>
          s.id === 'stoploss' ? { ...s, status: 'breach', current: 'Ledger imbalance' } : s,
        ),
      };
    }
    if (sim.explanationUnavailable) {
      next = {
        ...next,
        allocation: {
          ...next.allocation,
          rationale: ['Explanation temporarily unavailable for this decision.'],
        },
      };
    }
    if (sim.lateReversal) {
      next = {
        ...next,
        pauseReason:
          (next.pauseReason ?? '') +
          ' Late payment reversal detected; liability netConsumed adjusted.',
      };
    }

    return next;
  }, [base, overrides, localAudit, sim]);

  const setRole = (next: MerchantRole) => {
    setRoleState(next);
    localStorage.setItem(ROLE_STORAGE_KEY, next);
  };

  const setPhase = (next: DemoPhase) => {
    setPhaseState(next);
    localStorage.setItem(PHASE_STORAGE_KEY, next);
    setOverrides({});
    setLocalAudit([]);
    setSelectedDecisionId(null);
  };

  const setSimFlag = <K extends keyof SimFlags>(key: K, value: SimFlags[K]) => {
    setSim((prev) => ({ ...prev, [key]: value }));
  };

  const appendAudit = useCallback(
    (event: Omit<AuditEvent, 'id' | 'timestamp'> & { id?: string }) => {
      const row: AuditEvent = {
        id: event.id ?? `AUD-LOCAL-${Date.now()}`,
        timestamp: new Date().toISOString(),
        actor: event.actor,
        action: event.action,
        detail: event.detail,
      };
      setLocalAudit((prev) => [...prev, row]);
    },
    [],
  );

  const emitSimEvent = (name: string, detail = '') => {
    appendAudit({
      actor: 'developer',
      action: `sim_${name}`,
      detail: detail || `Simulation control: ${name}`,
    });
  };

  const isOwner = role === 'merchant_owner';
  const canApproveCharter =
    isOwner && (phase === 'charter_review' || phase === 'opportunity_found') && !fixture.charter.approvedByOwner;
  const canApproveLive =
    isOwner &&
    fixture.evidencePassed &&
    !fixture.liveApproved &&
    (phase === 'evidence_gate_passed' || phase === 'observation');
  const canStopOffers = isOwner && (phase === 'live_adaptive' || fixture.liveApproved) && !fixture.merchantStop;

  const approveCharter = () => {
    if (!canApproveCharter) return;
    appendAudit({
      actor: 'merchant_owner',
      action: 'charter_approved',
      detail: 'Owner approved charter; moving to Observation Mode.',
    });
    setPhase('observation');
  };

  const approveLive = () => {
    if (!isOwner || !fixture.evidencePassed) return;
    appendAudit({
      actor: 'merchant_owner',
      action: 'live_adaptive_approved',
      detail: 'Owner approved live adaptive allocation.',
    });
    setLiveApprovalOpen(false);
    setPhase('live_adaptive');
  };

  const stopNewOffers = (by: 'merchant' | 'hello_clever') => {
    if (by === 'merchant' && !isOwner) return;
    appendAudit({
      actor: by === 'merchant' ? 'merchant_owner' : 'hello_clever',
      action: 'stop_new_offers',
      detail: `${by === 'merchant' ? 'Merchant Owner' : 'Hello Clever'} stopped new offers.`,
    });
    setOverrides({
      merchantStop: by === 'merchant' ? true : fixture.merchantStop,
      helloCleverStop: by === 'hello_clever' ? true : fixture.helloCleverStop,
      pauseReason: 'New offers stopped. Existing offers remain immutable after send.',
      status: 'paused',
      statusLabel: 'Offers stopped',
    });
    if (phase === 'live_adaptive') setPhase('safety_pause');
  };

  const resumeOffers = () => {
    if (!isOwner) return;
    appendAudit({
      actor: 'merchant_owner',
      action: 'resume_offers',
      detail: 'Owner resumed new offers after review.',
    });
    setOverrides({});
    setPhase('live_adaptive');
  };

  const replayTodayDecision = () => {
    emitSimEvent('replay_decision', 'Replayed today’s allocation decision from fixtures.');
    setSelectedDecisionId(fixture.allocation.id);
  };

  const resetDemo = () => {
    setSim(DEFAULT_SIM);
    setOverrides({});
    setLocalAudit([]);
    setSelectedDecisionId(null);
    setPhase('opportunity_found');
    emitSimEvent('reset', 'Merchant Agentic Growth demo reset.');
  };

  const value: AgenticGrowthContextValue = {
    role,
    setRole,
    phase,
    setPhase,
    fixture,
    sim,
    setSimFlag,
    simDrawerOpen,
    setSimDrawerOpen,
    selectedDecisionId,
    setSelectedDecisionId,
    qualificationOpen,
    setQualificationOpen,
    messagePreviewOpen,
    setMessagePreviewOpen,
    liveApprovalOpen,
    setLiveApprovalOpen,
    isOwner,
    canApproveCharter,
    canApproveLive,
    canStopOffers,
    approveCharter,
    approveLive,
    stopNewOffers,
    resumeOffers,
    replayTodayDecision,
    resetDemo,
    appendAudit,
    handoff,
    emitSimEvent,
    phases: DEMO_PHASES,
  };

  return (
    <AgenticGrowthContext.Provider value={value}>{children}</AgenticGrowthContext.Provider>
  );
}

export function useAgenticGrowth() {
  const ctx = useContext(AgenticGrowthContext);
  if (!ctx) throw new Error('useAgenticGrowth must be used within AgenticGrowthProvider');
  return ctx;
}
