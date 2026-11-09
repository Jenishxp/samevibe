-- SameVibe schema. Run once in Supabase: SQL Editor -> New query -> paste -> Run.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 60),
  role text not null check (role in ('need_flat', 'have_flat')),
  city text not null,
  area text not null default '',
  budget_min int not null check (budget_min >= 0),
  budget_max int not null check (budget_max >= budget_min),
  sleep_hour int not null check (sleep_hour between 0 and 23),
  cleaning text not null check (cleaning in ('daily', 'few_week', 'weekly', 'relaxed')),
  smoking text not null check (smoking in ('no', 'outside', 'yes')),
  pets text not null check (pets in ('love', 'ok', 'no')),
  guests text not null check (guests in ('rarely', 'weekends', 'often')),
  bio text not null default '' check (char_length(bio) <= 300),
  created_at timestamptz not null default now()
);

-- Contact details live in their own table so they are only visible after a mutual match.
create table if not exists public.contacts (
  id uuid primary key references auth.users(id) on delete cascade,
  whatsapp text not null check (char_length(whatsapp) between 5 and 20)
);

create table if not exists public.likes (
  from_id uuid not null references auth.users(id) on delete cascade,
  to_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (from_id, to_id),
  check (from_id <> to_id)
);

alter table public.profiles enable row level security;
alter table public.contacts enable row level security;
alter table public.likes enable row level security;

-- profiles: any signed-in user can browse; you can only write your own
create policy "profiles readable by signed-in users" on public.profiles
  for select to authenticated using (true);
create policy "insert own profile" on public.profiles
  for insert to authenticated with check (auth.uid() = id);
create policy "update own profile" on public.profiles
  for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);
create policy "delete own profile" on public.profiles
  for delete to authenticated using (auth.uid() = id);

-- likes: you can see likes you sent or received, and only send as yourself
create policy "see own likes" on public.likes
  for select to authenticated using (auth.uid() = from_id or auth.uid() = to_id);
create policy "send like as self" on public.likes
  for insert to authenticated with check (auth.uid() = from_id);
create policy "remove own like" on public.likes
  for delete to authenticated using (auth.uid() = from_id);

-- contacts: yours always, someone else's only if you both liked each other
create policy "own contact or mutual match" on public.contacts
  for select to authenticated using (
    auth.uid() = id
    or (
      exists (select 1 from public.likes l where l.from_id = auth.uid() and l.to_id = contacts.id)
      and exists (select 1 from public.likes l where l.from_id = contacts.id and l.to_id = auth.uid())
    )
  );
create policy "insert own contact" on public.contacts
  for insert to authenticated with check (auth.uid() = id);
create policy "update own contact" on public.contacts
  for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);
create policy "delete own contact" on public.contacts
  for delete to authenticated using (auth.uid() = id);
