import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CashbackBalanceCard } from '../components/CashbackBalanceCard';
import { CustomerInsightPanel } from '../components/CustomerInsightPanel';
import { PaymentMethodList } from '../components/PaymentMethodList';
import { useDemo } from '../context/DemoContext';
import { moneyLabel } from '../lib/format';
import { firstErrorKey, validateContact, validateDelivery } from '../lib/validation';

export function PaymentGatewayPage() {
  const {
    cartEmpty,
    paymentStatus,
    receipt,
    total,
    amountDue,
    cashbackApplied,
    cashbackBalance,
    contact,
    delivery,
    currency,
    setFieldErrors,
  } = useDemo();
  const navigate = useNavigate();

  useEffect(() => {
    if (cartEmpty) {
      navigate('/checkout');
      return;
    }
    const errors = {
      ...validateContact(contact, currency),
      ...validateDelivery(delivery, currency),
    };
    if (firstErrorKey(errors)) {
      setFieldErrors(errors);
      navigate('/checkout');
    }
  }, [cartEmpty, contact, currency, delivery, navigate, setFieldErrors]);

  useEffect(() => {
    if (paymentStatus === 'succeeded' && receipt) {
      try {
        sessionStorage.setItem('dcal.receipt', JSON.stringify(receipt));
      } catch {
        /* ignore */
      }
      navigate('/order/confirmed');
    }
  }, [paymentStatus, receipt, navigate]);

  return (
    <div className="gateway-page">
      <div className="page gateway-page__content">
        <Link to="/checkout" className="gateway-page__back">
          Back to checkout
        </Link>

        <div className="gateway-page__intro">
          <h1 className="page-title">Choose how to pay</h1>
          <p className="gateway-page__amount-label">Amount to pay</p>
          {cashbackApplied > 0 && (
            <p className="gateway-page__amount-was">{moneyLabel(total, currency)}</p>
          )}
          <p className="gateway-page__amount">{moneyLabel(amountDue, currency)}</p>
        </div>

        <div
          className={`gateway-pay-layout ${cashbackBalance > 0 ? 'gateway-pay-layout--identified' : 'gateway-pay-layout--guest'}`}
        >
          {cashbackBalance > 0 && <CashbackBalanceCard />}
          <section className="card-surface gateway-payment-card" aria-label="Payment methods">
            <PaymentMethodList />
          </section>
        </div>

        <CustomerInsightPanel />
      </div>
    </div>
  );
}
