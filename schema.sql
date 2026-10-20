-- Supabase > SQL Editor: paste and Run
create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  content text default '',
  cover_image_url text,
  images text[] default '{}',
  published boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table posts enable row level security;
create policy "public read published" on posts for select using (published = true);
create policy "admin full access" on posts for all to authenticated using (true) with check (true);
