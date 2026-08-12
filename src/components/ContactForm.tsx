import { useDemo } from '../context/DemoContext';
import { formatMobileAu } from '../lib/format';
import { validateContact } from '../lib/validation';

export function ContactForm() {
  const { contact, setContact, fieldErrors, setFieldErrors } = useDemo();

  const onBlur = (name: 'email' | 'mobile') => {
    const errors = validateContact(contact);
    setFieldErrors({ ...fieldErrors, [name]: errors[name] });
  };

  return (
    <>
      <div className="field">
        <label htmlFor="email">Email address</label>
        <input
          className="input"
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          value={contact.email}
          aria-invalid={Boolean(fieldErrors.email)}
          aria-describedby={fieldErrors.email ? 'email-error' : undefined}
          onChange={(e) => setContact({ ...contact, email: e.target.value })}
          onBlur={() => onBlur('email')}
        />
        {fieldErrors.email && (
          <span className="field__error" id="email-error" role="alert">
            {fieldErrors.email}
          </span>
        )}
      </div>

      <div className="field">
        <label htmlFor="mobile">Mobile number</label>
        <span className="field__hint">Australian mobile · +61 format accepted</span>
        <input
          className="input"
          id="mobile"
          name="mobile"
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          placeholder="0412 345 678"
          value={contact.mobile}
          aria-invalid={Boolean(fieldErrors.mobile)}
          aria-describedby={fieldErrors.mobile ? 'mobile-error' : undefined}
          onChange={(e) =>
            setContact({ ...contact, mobile: formatMobileAu(e.target.value) })
          }
          onBlur={() => onBlur('mobile')}
        />
        {fieldErrors.mobile && (
          <span className="field__error" id="mobile-error" role="alert">
            {fieldErrors.mobile}
          </span>
        )}
      </div>

      <label className="checkbox-row">
        <input
          type="checkbox"
          checked={contact.smsUpdates}
          onChange={(e) => setContact({ ...contact, smsUpdates: e.target.checked })}
        />
        <span>Send me order updates by SMS</span>
      </label>
    </>
  );
}
