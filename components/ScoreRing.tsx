import { scoreTone } from '@/lib/matching';

export function ScoreRing({ score }: { score: number }) {
  return (
    <div className={`ring ${scoreTone(score)}`} style={{ ['--p' as string]: `${score}%` }} aria-label={`${score}% match`}>
      <span>{score}%</span>
    </div>
  );
}
