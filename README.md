# Jarvis Frontend (Next.js 14)

Frontend dell’assistente AI Jarvis basato su **Next.js 14** e **React 18**.

## 🚀 Deploy su Vercel

1. Vai su [https://vercel.com](https://vercel.com) e fai **New Project**.
2. Collega questo repository (`jarvis-frontend`).
3. Framework Preset: **Next.js**.
4. Root Directory: `./`.
5. Aggiungi la variabile ambiente:

```bash
NEXT_PUBLIC_BACKEND_URL=https://jarvis-backend-0fxm.onrender.com
```

6. Clicca **Deploy**.

## 📂 Struttura
- `app/` → pagine principali (`/clients`, `/costi`, `/kanban`, ecc.)
- `public/` → static assets
- `package.json` → dipendenze e script
- `next.config.js` → configurazione Next.js

## ✅ Test locale
```bash
npm install
npm run dev
```
Apri [http://localhost:3000](http://localhost:3000).
