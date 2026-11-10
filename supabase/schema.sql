-- Run this in Supabase SQL Editor to create the user's cloud todo storage.
create table if not exists public.todos (
  id uuid primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  created_at timestamptz not null default now(),
  kind text not null check (kind in ('once', 'daily')),
  days integer[] not null default '{}',
  time text not null default '',
  done_dates date[] not null default '{}',
  elapsed jsonb not null default '{}'::jsonb,
  sessions jsonb not null default '{}'::jsonb
);

alter table public.todos enable row level security;
create policy "Users can read their own todos" on public.todos for select using (auth.uid() = user_id);
create policy "Users can create their own todos" on public.todos for insert with check (auth.uid() = user_id);
create policy "Users can update their own todos" on public.todos for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can delete their own todos" on public.todos for delete using (auth.uid() = user_id);
