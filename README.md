# SameVibe

Flatmate matching by habits: budget, location, sleep time, cleaning, smoking, pets and guests.
Next.js (App Router) + Supabase. Runs in demo mode with no setup.

## Run locally
```
npm install
npm run dev
```
Leave `.env.local` empty for demo mode (sample profiles, data stays in your browser).

## Go live with real users
1. Create a Supabase project. Run `supabase/schema.sql` in the SQL Editor.
2. In Supabase: Project Settings > API. Copy the Project URL and the anon public key.
3. In Vercel, add env vars `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`, then redeploy.
4. In Supabase: Authentication > URL Configuration. Set Site URL to your Vercel URL and add `https://YOUR-APP.vercel.app/**` to Redirect URLs.

## How matching works
`lib/matching.ts`. Weighted score: budget 20, sleep 20, cleaning 20, location 15, smoking 10, guests 10, pets 5.
Different city caps the score at 20, no budget overlap at 45, a smoking conflict at 50.

## Privacy
WhatsApp numbers sit in a separate table. Row Level Security only reveals them after both people tap Interested.
