interface Props {
  value: number;
  onChange: (value: number) => void;
  label: string;
}

export function QuantityControl({ value, onChange, label }: Props) {
  return (
    <div className="qty" role="group" aria-label={`Quantity for ${label}`}>
      <button
        type="button"
        aria-label={`Decrease quantity of ${label}`}
        onClick={() => onChange(value - 1)}
        disabled={value <= 0}
      >
        −
      </button>
      <span aria-live="polite">{value}</span>
      <button
        type="button"
        aria-label={`Increase quantity of ${label}`}
        onClick={() => onChange(value + 1)}
        disabled={value >= 9}
      >
        +
      </button>
    </div>
  );
}
