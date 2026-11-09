'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AuthGate } from '@/components/AuthGate';
import { Choice } from '@/components/Choice';
import { isDemo, loadMe, saveMe, signOut } from '@/lib/store';
import {
  CLEANING_LABEL, GUESTS_LABEL, PETS_LABEL, ROLE_LABEL, SMOKING_LABEL, formatHour,
  type Cleaning, type Guests, type Pets, type Profile, type Role, type Smoking,
} from '@/lib/types';

const opts = <T extends string>(labels: Record<T, string>) =>
  (Object.keys(labels) as T[]).map((value) => ({ value, label: labels[value] }));
const SLEEP_HOURS = [21, 22, 23, 0, 1, 2, 3, 4];

function ProfileForm({ userId }: { userId: string }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<Role>('need_flat');
  const [city, setCity] = useState('Bengaluru');
  const [area, setArea] = useState('');
  const [budgetMin, setBudgetMin] = useState(10000);
  const [budgetMax, setBudgetMax] = useState(20000);
  const [sleepHour, setSleepHour] = useState(23);
  const [cleaning, setCleaning] = useState<Cleaning>('few_week');
  const [smoking, setSmoking] = useState<Smoking>('no');
  const [pets, setPets] = useState<Pets>('ok');
  const [guests, setGuests] = useState<Guests>('weekends');
  const [bio, setBio] = useState('');
  const [whatsapp, setWhatsapp] = useState('');

  useEffect(() => {
    loadMe(userId).then(({ profile, whatsapp: w }) => {
      if (profile) {
        setName(profile.name); setRole(profile.role); setCity(profile.city); setArea(profile.area);
        setBudgetMin(profile.budgetMin); setBudgetMax(profile.budgetMax); setSleepHour(profile.sleepHour);
        setCleaning(profile.cleaning); setSmoking(profile.smoking); setPets(profile.pets);
        setGuests(profile.guests); setBio(profile.bio);
      }
      setWhatsapp(w);
      setReady(true);
    });
  }, [userId]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (budgetMax < budgetMin) return setError('Maximum budget must be at least the minimum.');
    if (!isDemo && whatsapp.replace(/\D/g, '').length < 8) return setError('Add a WhatsApp number. It is only shown after a mutual match.');
    setSaving(true);
    const profile: Profile = {
      id: userId, name: name.trim(), role, city: city.trim(), area: area.trim(),
      budgetMin, budgetMax, sleepHour, cleaning, smoking, pets, guests, bio: bio.trim(),
    };
    const err = await saveMe(profile, whatsapp.trim());
    setSaving(false);
    if (err) return setError(err);
    router.push('/matches');
  }

  if (!ready) return <p className="muted pad">Loading…</p>;

  return (
    <form className="pad form" onSubmit={submit}>
      <h1 className="h1">Your profile</h1>
      <p className="muted">Be honest about your habits. A bad match helps no one.</p>

      <Choice label="I am" value={role} options={opts(ROLE_LABEL)} onChange={setRole} />

      <label className="field">
        <span className="field-label">First name</span>
        <input required maxLength={60} value={name} onChange={(e) => setName(e.target.value)} autoComplete="given-name" />
      </label>

      <div className="two">
        <label className="field">
          <span className="field-label">City</span>
          <input required value={city} onChange={(e) => setCity(e.target.value)} list="cities" />
          <datalist id="cities">
            <option value="Bengaluru" /><option value="Vadodara" /><option value="Mumbai" /><option value="Pune" /><option value="Delhi" /><option value="Hyderabad" />
          </datalist>
        </label>
        <label className="field">
          <span className="field-label">Area</span>
          <input value={area} onChange={(e) => setArea(e.target.value)} placeholder="Koramangala" />
        </label>
      </div>

      <div className="two">
        <label className="field">
          <span className="field-label">{role === 'have_flat' ? 'Rent from (₹/month)' : 'Budget from (₹/month)'}</span>
          <input type="number" inputMode="numeric" min={0} step={500} required value={budgetMin} onChange={(e) => setBudgetMin(Number(e.target.value))} />
        </label>
        <label className="field">
          <span className="field-label">{role === 'have_flat' ? 'Rent up to' : 'Budget up to'}</span>
          <input type="number" inputMode="numeric" min={0} step={500} required value={budgetMax} onChange={(e) => setBudgetMax(Number(e.target.value))} />
        </label>
      </div>

      <label className="field">
        <span className="field-label">I am in bed by</span>
        <select value={sleepHour} onChange={(e) => setSleepHour(Number(e.target.value))}>
          {SLEEP_HOURS.map((h) => <option key={h} value={h}>{formatHour(h)}</option>)}
        </select>
      </label>

      <Choice label="I clean the shared space" value={cleaning} options={opts(CLEANING_LABEL)} onChange={setCleaning} />
      <Choice label="Smoking" value={smoking} options={opts(SMOKING_LABEL)} onChange={setSmoking} />
      <Choice label="Pets" value={pets} options={opts(PETS_LABEL)} onChange={setPets} />
      <Choice label="Guests and parties" value={guests} options={opts(GUESTS_LABEL)} onChange={setGuests} />

      <label className="field">
        <span className="field-label">About you ({bio.length}/300)</span>
        <textarea rows={3} maxLength={300} value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Work or study, routine, what you want in a flatmate" />
      </label>

      <label className="field">
        <span className="field-label">WhatsApp number{isDemo ? ' (optional in demo)' : ''}</span>
        <input type="tel" inputMode="tel" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="+91 98765 43210" autoComplete="tel" />
        <span className="hint">Hidden until you and another person both tap Interested.</span>
      </label>

      {error && <p className="error" role="alert">{error}</p>}
      <button className="btn primary full" type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save profile and see matches'}</button>
      {!isDemo && <button type="button" className="btn ghost full" onClick={async () => { await signOut(); router.push('/'); }}>Log out</button>}
    </form>
  );
}

export default function ProfilePage() {
  return <AuthGate>{(id) => <ProfileForm userId={id} />}</AuthGate>;
}
