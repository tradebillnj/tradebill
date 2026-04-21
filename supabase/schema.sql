-- TradeBill Database Schema
-- Run this in the Supabase SQL Editor after creating your project

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles (extends auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  business_name text,
  phone text,
  address text,
  city text,
  state text,
  zip text,
  email text,
  stripe_customer_id text,
  subscription_status text not null default 'trial'
    check (subscription_status in ('trial', 'active', 'past_due', 'canceled')),
  trial_ends_at timestamptz not null default now() + interval '14 days',
  created_at timestamptz not null default now()
);

-- Clients
create table public.clients (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  email text,
  phone text,
  address text,
  city text,
  state text,
  zip text,
  notes text,
  created_at timestamptz not null default now()
);

-- Quotes
create table public.quotes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  client_id uuid references public.clients on delete set null,
  number text not null,
  status text not null default 'draft'
    check (status in ('draft', 'sent', 'accepted', 'declined', 'expired')),
  line_items jsonb not null default '[]',
  notes text,
  valid_until date,
  subtotal numeric not null default 0,
  tax_rate numeric not null default 0,
  tax_amount numeric not null default 0,
  total numeric not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Invoices
create table public.invoices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  client_id uuid references public.clients on delete set null,
  quote_id uuid references public.quotes on delete set null,
  number text not null,
  status text not null default 'draft'
    check (status in ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
  line_items jsonb not null default '[]',
  notes text,
  due_date date,
  subtotal numeric not null default 0,
  tax_rate numeric not null default 0,
  tax_amount numeric not null default 0,
  total numeric not null default 0,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Row Level Security: users can only access their own data
alter table public.profiles enable row level security;
alter table public.clients enable row level security;
alter table public.quotes enable row level security;
alter table public.invoices enable row level security;

create policy "Users own their profile" on public.profiles
  for all using (auth.uid() = id);

create policy "Users own their clients" on public.clients
  for all using (auth.uid() = user_id);

create policy "Users own their quotes" on public.quotes
  for all using (auth.uid() = user_id);

create policy "Users own their invoices" on public.invoices
  for all using (auth.uid() = user_id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Indexes for performance
create index on public.clients (user_id);
create index on public.quotes (user_id);
create index on public.quotes (client_id);
create index on public.invoices (user_id);
create index on public.invoices (client_id);
create index on public.invoices (quote_id);
