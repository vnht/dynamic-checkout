import { useDemo } from '../context/DemoContext';
import { AU_STATES, ID_PROVINCES, US_STATES } from '../lib/constants';
import { validateDelivery } from '../lib/validation';

export function DeliveryForm() {
  const { delivery, setDelivery, fieldErrors, setFieldErrors, currency } = useDemo();
  const isAud = currency === 'AUD';
  const isUsd = currency === 'USD';
  const states = isUsd ? US_STATES : currency === 'IDR' ? ID_PROVINCES : AU_STATES;
  const cityLabel = isAud ? 'Suburb' : 'City';
  const regionLabel = currency === 'IDR' ? 'Province' : 'State';
  const postcodeLabel = isUsd ? 'ZIP' : 'Postcode';
  const postcodeMax = isAud ? 4 : 5;

  const onBlur = (name: keyof typeof delivery) => {
    const errors = validateDelivery(delivery, currency);
    setFieldErrors({ ...fieldErrors, [name]: errors[name] });
  };

  return (
    <>
      <div className="form-grid form-grid--2">
        <div className="field">
          <label htmlFor="firstName">First name</label>
          <input
            className="input"
            id="firstName"
            name="firstName"
            autoComplete="given-name"
            value={delivery.firstName}
            aria-invalid={Boolean(fieldErrors.firstName)}
            aria-describedby={fieldErrors.firstName ? 'firstName-error' : undefined}
            onChange={(e) => setDelivery({ ...delivery, firstName: e.target.value })}
            onBlur={() => onBlur('firstName')}
          />
          {fieldErrors.firstName && (
            <span className="field__error" id="firstName-error" role="alert">
              {fieldErrors.firstName}
            </span>
          )}
        </div>
        <div className="field">
          <label htmlFor="lastName">Last name</label>
          <input
            className="input"
            id="lastName"
            name="lastName"
            autoComplete="family-name"
            value={delivery.lastName}
            aria-invalid={Boolean(fieldErrors.lastName)}
            aria-describedby={fieldErrors.lastName ? 'lastName-error' : undefined}
            onChange={(e) => setDelivery({ ...delivery, lastName: e.target.value })}
            onBlur={() => onBlur('lastName')}
          />
          {fieldErrors.lastName && (
            <span className="field__error" id="lastName-error" role="alert">
              {fieldErrors.lastName}
            </span>
          )}
        </div>
      </div>

      <div className="field">
        <label htmlFor="street">Street address</label>
        <input
          className="input"
          id="street"
          name="street"
          autoComplete="street-address"
          value={delivery.street}
          aria-invalid={Boolean(fieldErrors.street)}
          aria-describedby={fieldErrors.street ? 'street-error' : undefined}
          onChange={(e) => setDelivery({ ...delivery, street: e.target.value })}
          onBlur={() => onBlur('street')}
        />
        {fieldErrors.street && (
          <span className="field__error" id="street-error" role="alert">
            {fieldErrors.street}
          </span>
        )}
      </div>

      <div className="form-grid form-grid--2">
        <div className="field">
          <label htmlFor="suburb">{cityLabel}</label>
          <input
            className="input"
            id="suburb"
            name="suburb"
            autoComplete="address-level2"
            value={delivery.suburb}
            aria-invalid={Boolean(fieldErrors.suburb)}
            aria-describedby={fieldErrors.suburb ? 'suburb-error' : undefined}
            onChange={(e) => setDelivery({ ...delivery, suburb: e.target.value })}
            onBlur={() => onBlur('suburb')}
          />
          {fieldErrors.suburb && (
            <span className="field__error" id="suburb-error" role="alert">
              {fieldErrors.suburb}
            </span>
          )}
        </div>
        <div className="field">
          <label htmlFor="state">{regionLabel}</label>
          <select
            className="select"
            id="state"
            name="state"
            autoComplete="address-level1"
            value={delivery.state}
            aria-invalid={Boolean(fieldErrors.state)}
            aria-describedby={fieldErrors.state ? 'state-error' : undefined}
            onChange={(e) => setDelivery({ ...delivery, state: e.target.value })}
            onBlur={() => onBlur('state')}
          >
            <option value="">Select</option>
            {states.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
          {fieldErrors.state && (
            <span className="field__error" id="state-error" role="alert">
              {fieldErrors.state}
            </span>
          )}
        </div>
      </div>

      <div className="field" style={{ maxWidth: 180 }}>
        <label htmlFor="postcode">{postcodeLabel}</label>
        <input
          className="input"
          id="postcode"
          name="postcode"
          autoComplete="postal-code"
          inputMode="numeric"
          value={delivery.postcode}
          aria-invalid={Boolean(fieldErrors.postcode)}
          aria-describedby={fieldErrors.postcode ? 'postcode-error' : undefined}
          onChange={(e) =>
            setDelivery({
              ...delivery,
              postcode: e.target.value.replace(/\D/g, '').slice(0, postcodeMax),
            })
          }
          onBlur={() => onBlur('postcode')}
        />
        {fieldErrors.postcode && (
          <span className="field__error" id="postcode-error" role="alert">
            {fieldErrors.postcode}
          </span>
        )}
      </div>

      <div
        className="schedule__item"
        style={{ marginTop: '0.25rem' }}
        role="group"
        aria-label="Delivery option"
      >
        <span>
          <strong>Standard</strong> · Free · 2-4 business days
        </span>
        <span aria-hidden="true">✓</span>
      </div>
    </>
  );
}
