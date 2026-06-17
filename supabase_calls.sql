-- Tabella registro chiamate sincronizzate dal backup del telefono
-- (app "SMS Backup & Restore" -> Google Drive -> Jarvis).
-- Eseguire nello SQL Editor di Supabase dopo supabase_schema.sql.

create extension if not exists pgcrypto;

create table if not exists public.calls (
  id uuid primary key default gen_random_uuid(),
  -- Chiave naturale per il dedup tra backup successivi: numero + epoch(ms).
  external_id text not null unique,
  number text,
  number_normalized text,
  contact_name text,
  duration int default 0,
  call_date timestamp with time zone not null,
  type int default 0,
  type_label text,
  client_id uuid references public.clients(id) on delete set null,
  created_at timestamp with time zone default now()
);

create index if not exists calls_call_date_idx on public.calls (call_date desc);
create index if not exists calls_number_normalized_idx on public.calls (number_normalized);
create index if not exists calls_client_id_idx on public.calls (client_id);

-- RLS coerente con le altre tabelle del progetto (aperto; restringi in produzione).
alter table public.calls enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where polname = 'open_access_calls') then
    create policy open_access_calls on public.calls for all using (true) with check (true);
  end if;
end $$;
