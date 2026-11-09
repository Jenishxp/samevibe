export type Role = 'need_flat' | 'have_flat';
export type Cleaning = 'daily' | 'few_week' | 'weekly' | 'relaxed';
export type Smoking = 'no' | 'outside' | 'yes';
export type Pets = 'love' | 'ok' | 'no';
export type Guests = 'rarely' | 'weekends' | 'often';

export type Profile = {
  id: string;
  name: string;
  role: Role;
  city: string;
  area: string;
  budgetMin: number;
  budgetMax: number;
  sleepHour: number; // 0-23, hour you are in bed by (23 = 11 PM, 1 = 1 AM)
  cleaning: Cleaning;
  smoking: Smoking;
  pets: Pets;
  guests: Guests;
  bio: string;
  demo?: boolean;
  likesYou?: boolean; // demo mode only
};

export const ROLE_LABEL: Record<Role, string> = {
  need_flat: 'Needs a flat',
  have_flat: 'Has a flat',
};
export const CLEANING_LABEL: Record<Cleaning, string> = {
  daily: 'Every day',
  few_week: 'A few times a week',
  weekly: 'Once a week',
  relaxed: 'When it gets bad',
};
export const SMOKING_LABEL: Record<Smoking, string> = {
  no: 'No smoking',
  outside: 'Smokes outside',
  yes: 'Smokes indoors',
};
export const PETS_LABEL: Record<Pets, string> = {
  love: 'Loves pets',
  ok: 'Fine with pets',
  no: 'No pets',
};
export const GUESTS_LABEL: Record<Guests, string> = {
  rarely: 'Rarely has guests',
  weekends: 'Weekend guests',
  often: 'Hosts often',
};

export function formatHour(h: number): string {
  const hr = ((h + 11) % 12) + 1;
  return `${hr} ${h >= 12 ? 'PM' : 'AM'}`;
}
export function formatRupees(n: number): string {
  return n >= 1000 ? `₹${Math.round(n / 100) / 10}K` : `₹${n}`;
}
