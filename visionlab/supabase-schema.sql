-- Vision Lab Supabase setup
-- 1. Create a Supabase project.
-- 2. Run this file in the Supabase SQL editor.
-- 3. Create the storage bucket listed below if it is not created by the SQL.
-- 4. Add your project URL and anon key to visionlab/supabase-config.js.

create extension if not exists pgcrypto;

create table if not exists public.vision_projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null default 'Untitled Project',
  type text not null default 'Custom Project',
  status text not null default 'Draft',
  color text not null default '#9cd23f',
  description text not null default '',
  goal text not null default 'Grow audience',
  direction text not null default '',
  brain_dump text not null default '',
  report text not null default '',
  cover jsonb not null default '{"type":"default","data":""}'::jsonb,
  pinned boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.vision_mood_images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.vision_projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null default 'Mood board image',
  url text not null,
  path text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.vision_references (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.vision_projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  url text not null,
  note text not null default '',
  platform text not null default 'Reference',
  thumbnail text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.vision_activity (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  project_id uuid references public.vision_projects(id) on delete cascade,
  message text not null,
  created_at timestamptz not null default now()
);

alter table public.vision_projects enable row level security;
alter table public.vision_mood_images enable row level security;
alter table public.vision_references enable row level security;
alter table public.vision_activity enable row level security;

drop policy if exists "Users can read their own projects" on public.vision_projects;
drop policy if exists "Users can insert their own projects" on public.vision_projects;
drop policy if exists "Users can update their own projects" on public.vision_projects;
drop policy if exists "Users can delete their own projects" on public.vision_projects;

create policy "Users can read their own projects"
on public.vision_projects for select
using (auth.uid() = user_id);

create policy "Users can insert their own projects"
on public.vision_projects for insert
with check (auth.uid() = user_id);

create policy "Users can update their own projects"
on public.vision_projects for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete their own projects"
on public.vision_projects for delete
using (auth.uid() = user_id);

drop policy if exists "Users can read their own mood images" on public.vision_mood_images;
drop policy if exists "Users can insert their own mood images" on public.vision_mood_images;
drop policy if exists "Users can update their own mood images" on public.vision_mood_images;
drop policy if exists "Users can delete their own mood images" on public.vision_mood_images;

create policy "Users can read their own mood images"
on public.vision_mood_images for select
using (auth.uid() = user_id);

create policy "Users can insert their own mood images"
on public.vision_mood_images for insert
with check (auth.uid() = user_id);

create policy "Users can update their own mood images"
on public.vision_mood_images for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete their own mood images"
on public.vision_mood_images for delete
using (auth.uid() = user_id);

drop policy if exists "Users can read their own references" on public.vision_references;
drop policy if exists "Users can insert their own references" on public.vision_references;
drop policy if exists "Users can update their own references" on public.vision_references;
drop policy if exists "Users can delete their own references" on public.vision_references;

create policy "Users can read their own references"
on public.vision_references for select
using (auth.uid() = user_id);

create policy "Users can insert their own references"
on public.vision_references for insert
with check (auth.uid() = user_id);

create policy "Users can update their own references"
on public.vision_references for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete their own references"
on public.vision_references for delete
using (auth.uid() = user_id);

drop policy if exists "Users can read their own activity" on public.vision_activity;
drop policy if exists "Users can insert their own activity" on public.vision_activity;

create policy "Users can read their own activity"
on public.vision_activity for select
using (auth.uid() = user_id);

create policy "Users can insert their own activity"
on public.vision_activity for insert
with check (auth.uid() = user_id);

insert into storage.buckets (id, name, public)
values ('visionlab-moodboards', 'visionlab-moodboards', true)
on conflict (id) do nothing;

drop policy if exists "Users can read their own Vision Lab files" on storage.objects;
drop policy if exists "Users can upload their own Vision Lab files" on storage.objects;
drop policy if exists "Users can update their own Vision Lab files" on storage.objects;
drop policy if exists "Users can delete their own Vision Lab files" on storage.objects;

create policy "Users can read their own Vision Lab files"
on storage.objects for select
using (
  bucket_id = 'visionlab-moodboards'
  and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "Users can upload their own Vision Lab files"
on storage.objects for insert
with check (
  bucket_id = 'visionlab-moodboards'
  and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "Users can update their own Vision Lab files"
on storage.objects for update
using (
  bucket_id = 'visionlab-moodboards'
  and auth.uid()::text = (storage.foldername(name))[1]
)
with check (
  bucket_id = 'visionlab-moodboards'
  and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "Users can delete their own Vision Lab files"
on storage.objects for delete
using (
  bucket_id = 'visionlab-moodboards'
  and auth.uid()::text = (storage.foldername(name))[1]
);

create or replace function public.set_vision_project_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_vision_project_updated_at on public.vision_projects;
create trigger set_vision_project_updated_at
before update on public.vision_projects
for each row execute function public.set_vision_project_updated_at();
