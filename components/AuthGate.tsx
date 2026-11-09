'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { getUserId, signInWithEmail } from '@/lib/store';
import { supabase } from '@/lib/supabase';

export function AuthGate({ children }: { children: (userId: string) => ReactNode }) {
  const [userId, setUserId] = useState<string | null | undefined>(undefined);
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getUserId().then(setUserId);
    if (!supabase) return;
    const { data } = supabase.auth.onAuthStateChange((_e, session) => setUserId(session?.user.id ?? null));
    return () => data.subscription.unsubscribe();
  }, []);

  if (userId === undefined) return <p className="muted pad">Loading…</p>;
  if (userId) return <>{children(userId)}</>;

  return (
    <section className="pad">
      <h1 className="h1">Log in to find flatmates</h1>
      <p className="muted">Enter your email and we'll send you a login link. No password needed.</p>
      {sent ? (
        <p className="notice">Link sent to {email}. Open it on this phone to continue.</p>
      ) : (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setError('');
            const err = await signInWithEmail(email.trim());
            if (err) setError(err); else setSent(true);
          }}
        >
          <label className="field">
            <span className="field-label">Email</span>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
          </label>
          {error && <p className="error">{error}</p>}
          <button className="btn primary full" type="submit">Send login link</button>
        </form>
      )}
    </section>
  );
}
