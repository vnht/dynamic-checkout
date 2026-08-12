import { useEffect } from 'react';
import { OrderConfirmation } from '../components/OrderConfirmation';
import { useDemo } from '../context/DemoContext';

export function ConfirmationPage() {
  const { receipt } = useDemo();

  useEffect(() => {
    if (!receipt) return;
    try {
      sessionStorage.setItem('dcal.receipt', JSON.stringify(receipt));
    } catch {
      /* ignore */
    }
  }, [receipt]);

  return (
    <div className="page">
      <OrderConfirmation />
    </div>
  );
}
