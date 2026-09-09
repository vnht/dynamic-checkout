import type { ReactNode } from 'react';
import { CleverAiMark } from '../../components/CleverAiMark';
import type { AgentTurn } from '../lib/agentScript';

interface GrowthAgentProps {
  turn: AgentTurn;
  children?: ReactNode;
  actions?: ReactNode;
}

export function GrowthAgent({ turn, children, actions }: GrowthAgentProps) {
  return (
    <div className="ga">
      <header className="ga__header">
        <CleverAiMark />
        <p className={`ga__activity ga__activity--${turn.activity}`}>
          <span className="ga__activity-dot" aria-hidden="true" />
          {turn.activityLabel}
        </p>
      </header>

      <div className="ga__thread" aria-live="polite">
        <div className="ga__bubble">
          <p className="ga__greeting">{turn.greeting}</p>
          {turn.body.map((line) => (
            <p key={line} className="ga__line">
              {line}
            </p>
          ))}
          <p className="ga__hint">{turn.primaryHint}</p>
        </div>

        {children && <div className="ga__stage">{children}</div>}

        {actions && <div className="ga__actions">{actions}</div>}
      </div>
    </div>
  );
}
