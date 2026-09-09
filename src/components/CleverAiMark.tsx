export function CleverAiMark({ size = 'md' }: { size?: 'sm' | 'md' }) {
  return (
    <img
      src="/brand/clever-ai.svg"
      alt="Clever AI"
      className={`clever-ai-mark clever-ai-mark--${size}`}
    />
  );
}
