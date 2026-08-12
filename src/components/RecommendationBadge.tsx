interface Props {
  kind?: 'recommended' | 'your_choice' | 'saved';
  text?: string;
}

export function RecommendationBadge({ kind, text }: Props) {
  if (!kind) return null;
  if (kind === 'recommended') {
    return <span className="badge badge--recommended">{text ?? 'Recommended'}</span>;
  }
  if (kind === 'your_choice') {
    return <span className="badge badge--choice">Your choice</span>;
  }
  return <span className="badge badge--saved">Saved</span>;
}
