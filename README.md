
# Jarvis Frontend

Frontend dell’assistente AI Jarvis (Next.js + React).

## 🚀 Deploy su Vercel

1. Vai su [https://vercel.com](https://vercel.com) e fai **New Project**.
2. Collega questo repository (`jarvis-frontend`).
3. In fase di configurazione aggiungi la variabile ambiente:

```
NEXT_PUBLIC_BACKEND_URL=https://jarvis-backend-0fxm.onrender.com
```

(⚠️ Usa l’URL del backend che hai deployato su Render).

4. Fai **Deploy** → Vercel genererà un link pubblico tipo:
```
https://jarvis-frontend.vercel.app
```

## 📂 Struttura progetto
- `app/` → codice frontend Next.js
- `pages/` e `components/` → varie sezioni UI (Realtime, CRM, Trascrizioni, ecc.)
- `globals.css` → stile principale (tema scuro)

## ✅ Verifica
Dopo il deploy:
- Apri il link Vercel nel browser
- Vai alla sezione `Realtime` → registra un audio
- Controlla la sezione `Trascrizioni` → deve comparire la trascrizione salvata su Supabase
