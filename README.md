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
- **Parla con Jarvis** (`/jarvis`): conversazione vocale continua (voce in/out)
- **Clients**: CRUD clienti
- **Kanban**: task con status
- **Prodotti**: CRUD prodotti
- **Costi**: inserimento e totali per mese
- **Obiettivi**: obiettivi con progresso
- **Realtime**: stream eventi da tabella `logs`

## Parla con Jarvis (voce) 🎙️
La pagina `/jarvis` permette una **conversazione vocale continua**: parli al microfono,
Jarvis trascrive (Web Speech API), genera la risposta tramite un LLM e te la legge ad alta voce.

- Funziona meglio su **Chrome/Edge desktop** (riconoscimento vocale nativo).
- Le risposte arrivano da `app/api/chat/route.js`, una route compatibile OpenAI.
- **LLM gratis consigliato:** [Groq](https://console.groq.com) (bassa latenza, ideale per la voce).
  Imposta `LLM_API_KEY` in `.env.local` (vedi `.env.local.example`). In alternativa Gemini.
- Senza API key la pagina resta usabile in **modalità eco/demo**.

## Schema SQL di base (Supabase / Postgres)
Vedi `supabase_schema.sql` incluso nello zip per creare le tabelle richieste e le policy RLS minime.


## Seed (dati demo Wesionary)
1. Esegui `supabase_schema.sql` sul DB del progetto (SQL Editor).
2. Esegui `supabase_seed.sql` per popolare clienti, prodotti, task, costi, obiettivi e log.
3. Avvia l'app: i dati saranno visibili nelle rispettive sezioni.
