-- Apply in the Supabase SQL editor or via the Supabase CLI before enabling MVP data features.
create extension if not exists pgcrypto;

create table if not exists public.health_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  name text,
  age integer check (age between 16 and 120),
  emergency_contact text,
  blood_group text,
  allergies jsonb not null default '[]'::jsonb,
  medications jsonb not null default '[]'::jsonb,
  chronic_conditions jsonb not null default '[]'::jsonb,
  contraceptive_method text,
  preferred_language text not null default 'English',
  updated_at timestamptz not null default now()
);

create table if not exists public.period_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  start_date date not null,
  end_date date,
  cycle_length integer not null default 28 check (cycle_length between 15 and 60),
  symptoms jsonb not null default '[]'::jsonb,
  mood text,
  created_at timestamptz not null default now()
);

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  appointment_at timestamptz not null,
  location text,
  notes text,
  reminder_enabled boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz not null default now()
);

alter table public.health_profiles enable row level security;
alter table public.period_records enable row level security;
alter table public.appointments enable row level security;
alter table public.chat_messages enable row level security;

create policy "Users manage their own health profile" on public.health_profiles for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users manage their own period records" on public.period_records for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users manage their own appointments" on public.appointments for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users manage their own chat messages" on public.chat_messages for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create index if not exists period_records_user_start_idx on public.period_records (user_id, start_date desc);
create index if not exists appointments_user_date_idx on public.appointments (user_id, appointment_at);
create index if not exists chat_messages_user_created_idx on public.chat_messages (user_id, created_at);
