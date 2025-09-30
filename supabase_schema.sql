create extension if not exists pgcrypto;

-- Tabelle
create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company text,
  email text,
  phone text,
  notes text,
  created_at timestamp with time zone default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price numeric,
  created_at timestamp with time zone default now()
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  status text not null default 'todo',
  created_at timestamp with time zone default now()
);

create table if not exists public.costs (
  id uuid primary key default gen_random_uuid(),
  description text not null,
  amount numeric,
  category text,
  period date,
  created_at timestamp with time zone default now()
);

create table if not exists public.goals (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  progress int default 0,
  deadline date,
  created_at timestamp with time zone default now()
);

create table if not exists public.logs (
  id uuid primary key default gen_random_uuid(),
  message text not null,
  created_at timestamp with time zone default now()
);

-- RLS (semplice: anon può leggere/scrivere; restringi in produzione)
alter table public.clients enable row level security;
alter table public.products enable row level security;
alter table public.tasks enable row level security;
alter table public.costs enable row level security;
alter table public.goals enable row level security;
alter table public.logs enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where polname = 'open_access_clients') then
    create policy open_access_clients on public.clients for all using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where polname = 'open_access_products') then
    create policy open_access_products on public.products for all using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where polname = 'open_access_tasks') then
    create policy open_access_tasks on public.tasks for all using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where polname = 'open_access_costs') then
    create policy open_access_costs on public.costs for all using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where polname = 'open_access_goals') then
    create policy open_access_goals on public.goals for all using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where polname = 'open_access_logs') then
    create policy open_access_logs on public.logs for all using (true) with check (true);
  end if;
end $$;
