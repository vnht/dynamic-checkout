import { useEffect } from 'react';
import { DynamicCheckoutModeControl } from './DynamicCheckoutModeControl';
import { useDemo } from '../context/DemoContext';

export function DemoScenarioControl() {
  const { demoPanelOpen, setDemoPanelOpen } = useDemo();

  useEffect(() => {
    if (!demoPanelOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [demoPanelOpen]);

  return (
    <>
      {demoPanelOpen && (
        <div className="demo-modal">
          <button
            type="button"
            className="demo-modal__backdrop"
            aria-label="Close demo mode"
            onClick={() => setDemoPanelOpen(false)}
          />
          <div
            className="demo-drawer demo-drawer--wide"
            role="dialog"
            aria-modal="true"
            aria-label="How checkout appears"
          >
            <DynamicCheckoutModeControl />
            <button
              type="button"
              className="btn btn--dark btn--sm btn--full"
              onClick={() => setDemoPanelOpen(false)}
            >
              Select
            </button>
          </div>
        </div>
      )}
      <div className="demo-toolbar">
        <button
          type="button"
          className="demo-toolbar__toggle"
          aria-expanded={demoPanelOpen}
          onClick={() => setDemoPanelOpen(!demoPanelOpen)}
        >
          Change Demo Mode
        </button>
      </div>
    </>
  );
}
