import type { Profile } from './types';
import { formatHour } from './types';

export type Part = {
  key: 'budget' | 'location' | 'sleep' | 'cleaning' | 'smoking' | 'pets' | 'guests';
  label: string;
  weight: number;
  score: number; // 0-100
  note: string;
};
export type MatchResult = { score: number; parts: Part[]; conflicts: string[] };

const norm = (h: number) => (h < 12 ? h + 24 : h);
const pick = (table: number[], i: number) => table[Math.min(Math.max(i, 0), table.length - 1)];

const CLEAN_ORDER = ['daily', 'few_week', 'weekly', 'relaxed'];
const GUEST_ORDER = ['rarely', 'weekends', 'often'];

const SMOKE: Record<string, Record<string, number>> = {
  no: { no: 100, outside: 45, yes: 0 },
  outside: { no: 45, outside: 100, yes: 60 },
  yes: { no: 0, outside: 60, yes: 100 },
};
const PETS: Record<string, Record<string, number>> = {
  love: { love: 100, ok: 85, no: 40 },
  ok: { love: 85, ok: 100, no: 70 },
  no: { love: 40, ok: 70, no: 100 },
};

export function scoreMatch(a: Profile, b: Profile): MatchResult {
  const conflicts: string[] = [];
  const parts: Part[] = [];

  // Budget
  const overlapLow = Math.max(a.budgetMin, b.budgetMin);
  const overlapHigh = Math.min(a.budgetMax, b.budgetMax);
  let budgetScore: number;
  let budgetNote: string;
  if (overlapHigh >= overlapLow) {
    const span = Math.max(1, Math.min(a.budgetMax - a.budgetMin, b.budgetMax - b.budgetMin));
    budgetScore = 60 + 40 * Math.min(1, (overlapHigh - overlapLow) / span);
    budgetNote = 'Budgets overlap';
  } else {
    const gap = overlapLow - overlapHigh;
    budgetScore = Math.max(0, 40 - gap / 250);
    budgetNote = `Budgets are ₹${Math.round(gap / 100) * 100} apart`;
    conflicts.push('budget');
  }
  parts.push({ key: 'budget', label: 'Budget', weight: 20, score: budgetScore, note: budgetNote });

  // Location
  const sameCity = a.city.trim().toLowerCase() === b.city.trim().toLowerCase();
  const sameArea = sameCity && a.area.trim().toLowerCase() === b.area.trim().toLowerCase();
  const locScore = !sameCity ? 0 : sameArea ? 100 : 55;
  if (!sameCity) conflicts.push('city');
  parts.push({
    key: 'location',
    label: 'Location',
    weight: 15,
    score: locScore,
    note: !sameCity ? 'Different cities' : sameArea ? `Both want ${a.area}` : `Same city, different area`,
  });

  // Sleep
  const sleepDiff = Math.abs(norm(a.sleepHour) - norm(b.sleepHour));
  parts.push({
    key: 'sleep',
    label: 'Sleep',
    weight: 20,
    score: pick([100, 80, 50, 20, 0], sleepDiff),
    note: sleepDiff === 0 ? `Both sleep by ${formatHour(a.sleepHour)}` : `${formatHour(a.sleepHour)} vs ${formatHour(b.sleepHour)}`,
  });

  // Cleaning
  const cleanDiff = Math.abs(CLEAN_ORDER.indexOf(a.cleaning) - CLEAN_ORDER.indexOf(b.cleaning));
  parts.push({
    key: 'cleaning',
    label: 'Cleaning',
    weight: 20,
    score: pick([100, 70, 35, 0], cleanDiff),
    note: cleanDiff === 0 ? 'Same cleaning habits' : cleanDiff === 1 ? 'Close on cleaning' : 'Different cleaning standards',
  });

  // Smoking
  const smokeScore = SMOKE[a.smoking][b.smoking];
  if (smokeScore === 0) conflicts.push('smoking');
  parts.push({
    key: 'smoking',
    label: 'Smoking',
    weight: 10,
    score: smokeScore,
    note: smokeScore === 100 ? 'Same smoking stance' : smokeScore === 0 ? 'Smoking conflict' : 'Partly compatible',
  });

  // Pets
  const petScore = PETS[a.pets][b.pets];
  parts.push({
    key: 'pets',
    label: 'Pets',
    weight: 5,
    score: petScore,
    note: petScore === 100 ? 'Same view on pets' : petScore >= 70 ? 'Mostly fine' : 'Could clash on pets',
  });

  // Guests / parties
  const guestDiff = Math.abs(GUEST_ORDER.indexOf(a.guests) - GUEST_ORDER.indexOf(b.guests));
  parts.push({
    key: 'guests',
    label: 'Guests',
    weight: 10,
    score: pick([100, 55, 0], guestDiff),
    note: guestDiff === 0 ? 'Same guest habits' : guestDiff === 1 ? 'Slightly different' : 'Quiet home vs party house',
  });

  let total = parts.reduce((sum, p) => sum + (p.score * p.weight) / 100, 0);
  if (conflicts.includes('city')) total = Math.min(total, 20);
  else if (conflicts.includes('budget')) total = Math.min(total, 45);
  if (conflicts.includes('smoking')) total = Math.min(total, 50);

  return { score: Math.round(total), parts, conflicts };
}

export function scoreTone(score: number): 'great' | 'good' | 'meh' | 'low' {
  if (score >= 85) return 'great';
  if (score >= 70) return 'good';
  if (score >= 50) return 'meh';
  return 'low';
}
