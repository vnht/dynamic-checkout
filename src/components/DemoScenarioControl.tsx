import { DynamicCheckoutModeControl } from './DynamicCheckoutModeControl';
import { useDemo } from '../context/DemoContext';

export function DemoScenarioControl() {
  const { resetDemo, demoPanelOpen, setDemoPanelOpen } = useDemo();

  return (
    <div className="demo-toolbar">
      {demoPanelOpen && (
        <div className="demo-drawer demo-drawer--wide" role="dialog" aria-label="Set up Agentic Growth">
          <h2>Set up Agentic Growth</h2>
          <DynamicCheckoutModeControl />
          <button type="button" className="btn btn--dark btn--sm btn--full" onClick={resetDemo}>
            Reset
          </button>
        </div>
      )}
      <button
        type="button"
        className="demo-toolbar__toggle"
        aria-expanded={demoPanelOpen}
        onClick={() => setDemoPanelOpen(!demoPanelOpen)}
      >
        Set up Agentic Growth
      </button>
    </div>
  );
}
