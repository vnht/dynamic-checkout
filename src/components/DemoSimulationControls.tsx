interface Action {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'ghost';
}

interface Props {
  title?: string;
  hint: string;
  actions: Action[];
}

export function DemoSimulationControls({
  title = 'Demo simulation',
  hint,
  actions,
}: Props) {
  return (
    <div className="demo-sim" role="region" aria-label={title}>
      <p className="demo-sim__title">{title}</p>
      <p className="demo-sim__hint">{hint}</p>
      <div className="demo-sim__actions">
        {actions.map((action) => (
          <button
            key={action.label}
            type="button"
            className={`btn btn--sm ${action.variant === 'ghost' ? 'btn--ghost' : 'btn--dark'}`}
            onClick={action.onClick}
          >
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
}
