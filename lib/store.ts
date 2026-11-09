import { supabase, isDemo } from './supabase';
import { SEED_PROFILES, DEMO_CONTACT } from './seed';
import type { Profile } from './types';

const ME_KEY = 'samevibe.me';
const LIKES_KEY = 'samevibe.likes';

type Row = {
  id: string; name: string; role: Profile['role']; city: string; area: string;
  budget_min: number; budget_max: number; sleep_hour: number;
  cleaning: Profile['cleaning']; smoking: Profile['smoking']; pets: Profile['pets'];
  guests: Profile['guests']; bio: string;
};

const fromRow = (r: Row): Profile => ({
  id: r.id, name: r.name, role: r.role, city: r.city, area: r.area,
  budgetMin: r.budget_min, budgetMax: r.budget_max, sleepHour: r.sleep_hour,
  cleaning: r.cleaning, smoking: r.smoking, pets: r.pets, guests: r.guests, bio: r.bio,
});
const toRow = (p: Profile): Row => ({
  id: p.id, name: p.name, role: p.role, city: p.city, area: p.area,
  budget_min: p.budgetMin, budget_max: p.budgetMax, sleep_hour: p.sleepHour,
  cleaning: p.cleaning, smoking: p.smoking, pets: p.pets, guests: p.guests, bio: p.bio,
});

const readJSON = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

export async function getUserId(): Promise<string | null> {
  if (!supabase) return 'me';
  const { data } = await supabase.auth.getSession();
  return data.session?.user.id ?? null;
}

export async function loadMe(userId: string): Promise<{ profile: Profile | null; whatsapp: string }> {
  if (!supabase) return { profile: readJSON<Profile | null>(ME_KEY, null), whatsapp: '' };
  const [p, c] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', userId).maybeSingle(),
    supabase.from('contacts').select('whatsapp').eq('id', userId).maybeSingle(),
  ]);
  return { profile: p.data ? fromRow(p.data as Row) : null, whatsapp: (c.data?.whatsapp as string) ?? '' };
}

export async function saveMe(profile: Profile, whatsapp: string): Promise<string | null> {
  if (!supabase) {
    localStorage.setItem(ME_KEY, JSON.stringify(profile));
    return null;
  }
  const p = await supabase.from('profiles').upsert(toRow(profile));
  if (p.error) return p.error.message;
  const c = await supabase.from('contacts').upsert({ id: profile.id, whatsapp });
  return c.error ? c.error.message : null;
}

export async function loadOthers(userId: string): Promise<Profile[]> {
  if (!supabase) return SEED_PROFILES;
  const { data } = await supabase.from('profiles').select('*').neq('id', userId);
  return ((data ?? []) as Row[]).map(fromRow);
}

export async function loadLikes(userId: string): Promise<{ sent: Set<string>; received: Set<string> }> {
  if (!supabase) return { sent: new Set(readJSON<string[]>(LIKES_KEY, [])), received: new Set(SEED_PROFILES.filter((s) => s.likesYou).map((s) => s.id)) };
  const { data } = await supabase.from('likes').select('from_id,to_id');
  const sent = new Set<string>();
  const received = new Set<string>();
  (data ?? []).forEach((l: { from_id: string; to_id: string }) => {
    if (l.from_id === userId) sent.add(l.to_id);
    else received.add(l.from_id);
  });
  return { sent, received };
}

export async function setLike(userId: string, targetId: string, on: boolean): Promise<void> {
  if (!supabase) {
    const set = new Set(readJSON<string[]>(LIKES_KEY, []));
    if (on) set.add(targetId); else set.delete(targetId);
    localStorage.setItem(LIKES_KEY, JSON.stringify([...set]));
    return;
  }
  if (on) await supabase.from('likes').upsert({ from_id: userId, to_id: targetId });
  else await supabase.from('likes').delete().eq('from_id', userId).eq('to_id', targetId);
}

// Returns the contact only when both people liked each other (enforced by database policy).
export async function getContact(targetId: string): Promise<string | null> {
  if (!supabase) return DEMO_CONTACT;
  const { data } = await supabase.from('contacts').select('whatsapp').eq('id', targetId).maybeSingle();
  return (data?.whatsapp as string) ?? null;
}

export async function signInWithEmail(email: string): Promise<string | null> {
  if (!supabase) return null;
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${window.location.origin}/matches` },
  });
  return error ? error.message : null;
}

export async function signOut(): Promise<void> {
  if (supabase) await supabase.auth.signOut();
}

export { isDemo };
