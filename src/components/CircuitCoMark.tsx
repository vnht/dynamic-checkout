export function CircuitCoMark({ size = 'md' }: { size?: 'sm' | 'md' }) {
  return (
    <img
      src="/brand/circuit-and-co.png"
      alt=""
      className={`circuit-mark circuit-mark--${size}`}
    />
  );
}
