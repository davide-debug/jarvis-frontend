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
- **Chiamate**: registro chiamate sincronizzato dal telefono (vedi sotto)
- **Kanban**: task con status
- **Prodotti**: CRUD prodotti
- **Costi**: inserimento e totali per mese
- **Obiettivi**: obiettivi con progresso
- **Realtime**: stream eventi da tabella `logs`

## Sincronizzazione chiamate del telefono

Flusso: l'app Android **SMS Backup & Restore** (SyncTech) salva il registro
chiamate come file `calls-*.xml` su Google Drive → Jarvis legge l'ultimo
backup, lo parsa e lo importa in Supabase collegando le chiamate ai clienti
per numero di telefono.

### Setup
1. **DB**: esegui `supabase_calls.sql` nello SQL Editor di Supabase (crea la
   tabella `calls`).
2. **App telefono**: in SMS Backup & Restore attiva il backup del *Call log*
   con upload automatico su Google Drive (cartella dedicata consigliata).
3. **Service account Google**:
   - crea un service account su Google Cloud, abilita la *Google Drive API*,
     genera una chiave JSON;
   - condividi la cartella di Drive dei backup con l'email del service account
     (accesso in lettura);
   - imposta `GOOGLE_SERVICE_ACCOUNT_JSON` (JSON raw o base64) e, opzionale,
     `GDRIVE_CALLS_FOLDER_ID`.
4. **Supabase service role**: imposta `SUPABASE_SERVICE_ROLE_KEY` (lato server).
5. *(Produzione)* imposta `CALLS_SYNC_SECRET` per proteggere l'endpoint.

### Uso
- Pagina **Chiamate** → `🔄 Sincronizza da Drive` importa l'ultimo backup.
- `📁 Carica XML` permette di importare un file a mano (funziona subito, anche
  senza credenziali Google).
- Il cron in `vercel.json` esegue la sync ogni giorno alle 06:00.
- Le chiamate vengono deduplicate su `external_id` (numero + timestamp), quindi
  re-importare lo stesso backup non crea duplicati.

## Schema SQL di base (Supabase / Postgres)
Vedi `supabase_schema.sql` incluso nello zip per creare le tabelle richieste e le policy RLS minime.


## Seed (dati demo Wesionary)
1. Esegui `supabase_schema.sql` sul DB del progetto (SQL Editor).
2. Esegui `supabase_seed.sql` per popolare clienti, prodotti, task, costi, obiettivi e log.
3. Avvia l'app: i dati saranno visibili nelle rispettive sezioni.
