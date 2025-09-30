# Jarvis Frontend (Next.js 14 + Tailwind + Supabase)

## Variabili su Vercel / .env.local
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- *(opzionale)* `NEXT_PUBLIC_BACKEND_URL`

## Come usare
```bash
npm install
npm run dev
# oppure
npm run build && npm start
```

Sezioni operative:
- **Clients**: CRUD clienti
- **Kanban**: task con status
- **Prodotti**: CRUD prodotti
- **Costi**: inserimento e totali per mese
- **Obiettivi**: obiettivi con progresso
- **Realtime**: stream eventi da tabella `logs`

## Schema SQL di base (Supabase / Postgres)
Vedi `supabase_schema.sql` incluso nello zip per creare le tabelle richieste e le policy RLS minime.


## Seed (dati demo Wesionary)
1. Esegui `supabase_schema.sql` sul DB del progetto (SQL Editor).
2. Esegui `supabase_seed.sql` per popolare clienti, prodotti, task, costi, obiettivi e log.
3. Avvia l'app: i dati saranno visibili nelle rispettive sezioni.
