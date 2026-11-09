import type { Profile } from './types';

// Sample people shown in demo mode only. Not real users.
export const SEED_PROFILES: Profile[] = [
  { id: 'd1', name: 'Aarav', role: 'have_flat', city: 'Bengaluru', area: 'Koramangala', budgetMin: 15000, budgetMax: 20000, sleepHour: 23, cleaning: 'daily', smoking: 'no', pets: 'love', guests: 'rarely', bio: '2BHK, one room free. Software engineer, WFH twice a week. Have a beagle called Biscuit.', likesYou: true },
  { id: 'd2', name: 'Meera', role: 'need_flat', city: 'Bengaluru', area: 'Koramangala', budgetMin: 12000, budgetMax: 18000, sleepHour: 23, cleaning: 'few_week', smoking: 'no', pets: 'ok', guests: 'weekends', bio: 'Product designer, new in town. Early riser, cooks on Sundays.', likesYou: true },
  { id: 'd3', name: 'Kabir', role: 'have_flat', city: 'Bengaluru', area: 'HSR Layout', budgetMin: 18000, budgetMax: 24000, sleepHour: 1, cleaning: 'weekly', smoking: 'outside', pets: 'ok', guests: 'often', bio: 'Big flat, big balcony. Love hosting friends on weekends.' },
  { id: 'd4', name: 'Sana', role: 'need_flat', city: 'Bengaluru', area: 'Indiranagar', budgetMin: 20000, budgetMax: 28000, sleepHour: 0, cleaning: 'daily', smoking: 'no', pets: 'love', guests: 'weekends', bio: 'Marketing manager. Neat, quiet on weekdays, looking for a long-term place.' },
  { id: 'd5', name: 'Rohan', role: 'need_flat', city: 'Bengaluru', area: 'BTM Layout', budgetMin: 8000, budgetMax: 12000, sleepHour: 2, cleaning: 'relaxed', smoking: 'yes', pets: 'no', guests: 'often', bio: 'Night owl, works in gaming. Looking for a chill, flexible flatmate.' },
  { id: 'd6', name: 'Ishita', role: 'have_flat', city: 'Bengaluru', area: 'Whitefield', budgetMin: 14000, budgetMax: 17000, sleepHour: 22, cleaning: 'daily', smoking: 'no', pets: 'ok', guests: 'rarely', bio: 'Works near ITPL. Prefer a calm home and a flatmate who cleans up after themselves.' },
  { id: 'd7', name: 'Dev', role: 'need_flat', city: 'Bengaluru', area: 'Koramangala', budgetMin: 15000, budgetMax: 22000, sleepHour: 0, cleaning: 'weekly', smoking: 'outside', pets: 'love', guests: 'weekends', bio: 'Startup founder, home late some nights. Respectful of shared space.' },
  { id: 'd8', name: 'Nisha', role: 'have_flat', city: 'Vadodara', area: 'Alkapuri', budgetMin: 7000, budgetMax: 10000, sleepHour: 23, cleaning: 'few_week', smoking: 'no', pets: 'ok', guests: 'rarely', bio: 'Working professional. Furnished room, fast wifi, 5 min from the station.', likesYou: true },
  { id: 'd9', name: 'Yash', role: 'need_flat', city: 'Vadodara', area: 'Gotri', budgetMin: 5000, budgetMax: 8000, sleepHour: 0, cleaning: 'weekly', smoking: 'no', pets: 'love', guests: 'weekends', bio: 'CS student on an internship. Quiet, into football and cooking.' },
  { id: 'd10', name: 'Pooja', role: 'need_flat', city: 'Vadodara', area: 'Akota', budgetMin: 6000, budgetMax: 9000, sleepHour: 23, cleaning: 'daily', smoking: 'no', pets: 'no', guests: 'rarely', bio: 'Designer and early sleeper. Looking for a tidy, calm flat.' },
  { id: 'd11', name: 'Harsh', role: 'have_flat', city: 'Vadodara', area: 'Alkapuri', budgetMin: 9000, budgetMax: 13000, sleepHour: 1, cleaning: 'relaxed', smoking: 'outside', pets: 'ok', guests: 'often', bio: '3BHK, lively home. Friends visit often, so no strict quiet hours.' },
  { id: 'd12', name: 'Tanvi', role: 'have_flat', city: 'Vadodara', area: 'Gotri', budgetMin: 6000, budgetMax: 8500, sleepHour: 23, cleaning: 'few_week', smoking: 'no', pets: 'love', guests: 'weekends', bio: 'Have a dog named Mocha. Easygoing, shares groceries and chores.' },
].map((p) => ({ ...p, demo: true })) as Profile[];

export const DEMO_CONTACT = 'Demo profile. Connect Supabase to see real contacts.';
