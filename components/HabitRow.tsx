export type Tint = 'yellow' | 'blue' | 'pink' | 'mint';

export function HabitRow({ tint, icon, label, value }: { tint: Tint; icon: string; label: string; value: string }) {
  return (
    <div className={`habit ${tint}`}>
      <span className="habit-icon" aria-hidden="true">{icon}</span>
      <span className="habit-text">
        <span className="habit-label">{label}</span>
        <span className="habit-value">{value}</span>
      </span>
    </div>
  );
}
