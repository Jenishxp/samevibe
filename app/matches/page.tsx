'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { AuthGate } from '@/components/AuthGate';
import { HabitRow } from '@/components/HabitRow';
import { ScoreRing } from '@/components/ScoreRing';
import { getContact, isDemo, loadLikes, loadMe, loadOthers, setLike } from '@/lib/store';
import { scoreMatch } from '@/lib/matching';
import {
  CLEANING_LABEL, GUESTS_LABEL, PETS_LABEL, ROLE_LABEL, SMOKING_LABEL, formatHour, formatRupees,
  type Profile, type Role,
} from '@/lib/types';

type Filter = 'all' | Role;

function Matches({ userId }: { userId: string }) {
  const [me, setMe] = useState<Profile | null | undefined>(undefined);
  const [others, setOthers] = useState<Profile[]>([]);
  const [sent, setSent] = useState<Set<string>>(new Set());
  const [received, setReceived] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<Filter>('all');
  const [open, setOpen] = useState<string | null>(null);
  const [contacts, setContacts] = useState<Record<string, string>>({});

  useEffect(() => {
    (async () => {
      const [{ profile }, list, likes] = await Promise.all([loadMe(userId), loadOthers(userId), loadLikes(userId)]);
      setMe(profile); setOthers(list); setSent(likes.sent); setReceived(likes.received);
    })();
  }, [userId]);

  const ranked = useMemo(() => {
    if (!me) return [];
    return others
      .filter((o) => filter === 'all' || o.role === filter)
      .map((o) => ({ p: o, r: scoreMatch(me, o) }))
      .sort((a, b) => b.r.score - a.r.score);
  }, [me, others, filter]);

  async function toggle(p: Profile) {
    const on = !sent.has(p.id);
    const next = new Set(sent);
    if (on) next.add(p.id); else next.delete(p.id);
    setSent(next);
    await setLike(userId, p.id, on);
    if (on && received.has(p.id)) {
      const c = await getContact(p.id);
      if (c) setContacts((prev) => ({ ...prev, [p.id]: c }));
    }
  }

  // Load contacts for existing mutual matches
  useEffect(() => {
    sent.forEach(async (id) => {
      if (received.has(id) && !contacts[id]) {
        const c = await getContact(id);
        if (c) setContacts((prev) => ({ ...prev, [id]: c }));
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sent, received]);

  if (me === undefined) return <p className="muted pad">Loading…</p>;
  if (me === null) {
    return (
      <section className="pad">
        <h1 className="h1">Make your profile first</h1>
        <p className="muted">Matches are ranked against your habits, so we need them before we can show anyone.</p>
        <Link href="/profile" className="btn primary full">Create my profile</Link>
      </section>
    );
  }

  return (
    <div className="pad">
      <h1 className="h1">Your matches</h1>
      {isDemo && <p className="notice">Demo mode: these are sample people, and your profile is saved only in this browser.</p>}

      <div className="choice filters" role="group" aria-label="Filter matches">
        {([['all', 'Everyone'], ['have_flat', 'Have a flat'], ['need_flat', 'Need a flat']] as [Filter, string][]).map(([v, l]) => (
          <button key={v} type="button" className={filter === v ? 'on' : ''} aria-pressed={filter === v} onClick={() => setFilter(v)}>{l}</button>
        ))}
      </div>

      {ranked.length === 0 && <p className="muted">No one here yet. Invite a friend to join, or switch the filter.</p>}

      <ul className="cards">
        {ranked.map(({ p, r }) => {
          const liked = sent.has(p.id);
          const mutual = liked && received.has(p.id);
          return (
            <li key={p.id} className="card">
              <div className="card-head">
                <ScoreRing score={r.score} />
                <div className="card-title">
                  <h2>{p.name}</h2>
                  <p className="muted small">{ROLE_LABEL[p.role]} · {p.area ? `${p.area}, ` : ''}{p.city}</p>
                </div>
              </div>

              <div className="stack tight">
                <HabitRow tint="yellow" icon="💰" label="Budget" value={`${formatRupees(p.budgetMin)}–${formatRupees(p.budgetMax)}`} />
                <HabitRow tint="pink" icon="🌙" label="Sleep" value={`By ${formatHour(p.sleepHour)}`} />
                <HabitRow tint="mint" icon="🧹" label="Cleaning" value={CLEANING_LABEL[p.cleaning]} />
                <HabitRow tint="blue" icon="🐾" label="Pets, smoke, guests" value={`${PETS_LABEL[p.pets]} · ${SMOKING_LABEL[p.smoking]} · ${GUESTS_LABEL[p.guests]}`} />
              </div>

              {p.bio && <p className="bio">{p.bio}</p>}

              <button type="button" className="link" aria-expanded={open === p.id} onClick={() => setOpen(open === p.id ? null : p.id)}>
                {open === p.id ? 'Hide why' : `Why ${r.score}%?`}
              </button>
              {open === p.id && (
                <ul className="why">
                  {r.parts.map((part) => (
                    <li key={part.key}>
                      <span>{part.label}: {part.note}</span>
                      <span className="bar" aria-hidden="true"><i style={{ width: `${part.score}%` }} /></span>
                    </li>
                  ))}
                </ul>
              )}

              {mutual ? (
                <p className="mutual">
                  It's a match. {contacts[p.id] ?? 'Loading contact…'}
                </p>
              ) : (
                <button type="button" className={`btn full ${liked ? '' : 'primary'}`} onClick={() => toggle(p)}>
                  {liked ? 'Interested (tap to undo)' : 'Interested'}
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function MatchesPage() {
  return <AuthGate>{(id) => <Matches userId={id} />}</AuthGate>;
}
