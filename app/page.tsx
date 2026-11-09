'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { scoreMatch } from '@/lib/matching';
import { HabitRow } from '@/components/HabitRow';
import { ScoreRing } from '@/components/ScoreRing';
import { formatHour, type Profile } from '@/lib/types';

const base: Profile = {
  id: 'a', name: 'You', role: 'need_flat', city: 'Bengaluru', area: 'Koramangala',
  budgetMin: 15000, budgetMax: 20000, sleepHour: 23, cleaning: 'daily', smoking: 'no', pets: 'love', guests: 'rarely', bio: '',
};
const SLEEP = [23, 0, 1, 2];
const CLEAN: { v: Profile['cleaning']; l: string }[] = [
  { v: 'daily', l: 'Every day' },
  { v: 'weekly', l: 'Weekly' },
  { v: 'relaxed', l: 'When it gets bad' },
];

export default function Home() {
  const [sleep, setSleep] = useState(23);
  const [cleaning, setCleaning] = useState<Profile['cleaning']>('daily');
  const result = useMemo(
    () => scoreMatch(base, { ...base, id: 'b', name: 'Flatmate', sleepHour: sleep, cleaning, guests: sleep <= 2 && sleep >= 0 && sleep !== 23 ? 'often' : 'rarely' }),
    [sleep, cleaning],
  );

  return (
    <div className="pad">
      <h1 className="display">Find flatmates who live like you.</h1>
      <p className="lede">Post that you need a flat or have a room. Say how you sleep, clean and live. SameVibe ranks everyone by how well your habits fit.</p>

      <div className="stack">
        <HabitRow tint="yellow" icon="💰" label="Budget" value="₹15–20K" />
        <HabitRow tint="blue" icon="📍" label="Location" value="Koramangala" />
        <HabitRow tint="pink" icon="🌙" label="Sleep" value={`By ${formatHour(23)}`} />
        <HabitRow tint="mint" icon="🧹" label="Cleaning" value="Every day" />
      </div>

      <section className="demo" aria-labelledby="demo-h">
        <h2 id="demo-h" className="h2">Try it: change your future flatmate</h2>
        <div className="venn">
          <div className="circle blue" />
          <div className="circle pink" />
          <ScoreRing score={result.score} />
        </div>
        <div className="field">
          <span className="field-label">Their sleep time</span>
          <div className="choice">
            {SLEEP.map((h) => (
              <button key={h} className={sleep === h ? 'on' : ''} onClick={() => setSleep(h)} type="button">{formatHour(h)}</button>
            ))}
          </div>
        </div>
        <div className="field">
          <span className="field-label">Their cleaning</span>
          <div className="choice">
            {CLEAN.map((c) => (
              <button key={c.v} className={cleaning === c.v ? 'on' : ''} onClick={() => setCleaning(c.v)} type="button">{c.l}</button>
            ))}
          </div>
        </div>
        <p className="muted small">
          {result.score >= 85 ? 'Same habits, same vibe.' : result.score >= 60 ? 'Workable, with a conversation about house rules.' : 'A 1 AM party and an 11 PM bedtime rarely mix.'}
        </p>
      </section>

      <div className="cta-row">
        <Link href="/profile" className="btn primary">Create my profile</Link>
        <Link href="/matches" className="btn">See matches</Link>
      </div>
    </div>
  );
}
