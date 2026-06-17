// Recupero dell'ultimo backup del registro chiamate da Google Drive.
// Autenticazione tramite service account (cartella di Drive condivisa con
// l'email del service account). Variabili d'ambiente richieste:
//   GOOGLE_SERVICE_ACCOUNT_JSON  -> JSON delle credenziali (raw o base64)
//   GDRIVE_CALLS_FOLDER_ID       -> (opzionale) id della cartella dei backup
import { google } from 'googleapis';

function loadCredentials() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!raw) {
    throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON non configurato');
  }
  // Accetta sia JSON grezzo sia base64 (comodo per le env di Vercel).
  const text = raw.trim().startsWith('{')
    ? raw
    : Buffer.from(raw, 'base64').toString('utf-8');
  return JSON.parse(text);
}

function getDrive() {
  const auth = new google.auth.GoogleAuth({
    credentials: loadCredentials(),
    scopes: ['https://www.googleapis.com/auth/drive.readonly'],
  });
  return google.drive({ version: 'v3', auth });
}

// Trova il file calls-*.xml piu' recente e ne restituisce { name, id, xml }.
export async function fetchLatestCallsBackup() {
  const drive = getDrive();
  const folderId = process.env.GDRIVE_CALLS_FOLDER_ID;

  let q = "name contains 'calls-' and trashed = false";
  if (folderId) q += ` and '${folderId}' in parents`;

  const list = await drive.files.list({
    q,
    orderBy: 'createdTime desc',
    pageSize: 5,
    fields: 'files(id, name, createdTime)',
    supportsAllDrives: true,
    includeItemsFromAllDrives: true,
    corpora: folderId ? 'allDrives' : 'user',
  });

  const file = (list.data.files || []).find((f) => f.name.endsWith('.xml'));
  if (!file) {
    throw new Error('Nessun backup calls-*.xml trovato su Google Drive');
  }

  const res = await drive.files.get(
    { fileId: file.id, alt: 'media', supportsAllDrives: true },
    { responseType: 'text' }
  );

  return { name: file.name, id: file.id, xml: res.data };
}
