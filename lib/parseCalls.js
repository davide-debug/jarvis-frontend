// Parser per i backup del registro chiamate prodotti dall'app
// "SMS Backup & Restore" (SyncTech). Ogni file e' un backup "full":
// un elemento <calls> con N elementi <call .../> auto-chiusi.
//
// Nessuna dipendenza esterna: gli elementi sono piatti e regolari,
// quindi estraiamo gli attributi con una regex sui delimitatori ".

const TYPE_LABELS = {
  1: 'in_entrata',
  2: 'in_uscita',
  3: 'persa',
  4: 'segreteria',
  5: 'rifiutata',
  6: 'bloccata',
};

// Decodifica le entita' XML piu' comuni presenti nei valori.
function unescapeXml(value) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}

// Tiene solo le cifre. Gestisce eventuale prefisso "+".
export function digitsOnly(number) {
  return (number || '').replace(/[^0-9]/g, '');
}

// Numero normalizzato per il confronto con i clienti: cifre senza il
// prefisso internazionale italiano (39) quando presente. Es:
//   +39 335 8448062 -> 3358448062
//   051 6861504      -> 0516861504
export function normalizeNumber(number) {
  let d = digitsOnly(number);
  if (d.length >= 11 && d.startsWith('39')) d = d.slice(2);
  if (d.startsWith('0039')) d = d.slice(4);
  return d;
}

// Due numeri "corrispondono" se condividono un suffisso significativo
// (>= 7 cifre). Copre i casi in cui il cliente e' salvato con/senza
// prefisso o con spazi diversi.
export function numbersMatch(a, b) {
  const na = normalizeNumber(a);
  const nb = normalizeNumber(b);
  if (!na || !nb) return false;
  const min = Math.min(na.length, nb.length);
  if (min < 7) return na === nb;
  const suffix = min >= 9 ? 9 : min;
  return na.slice(-suffix) === nb.slice(-suffix);
}

// Estrae tutti gli attributi key="value" da un tag <call ... />.
function parseAttributes(tag) {
  const attrs = {};
  const re = /([a-zA-Z_][\w-]*)\s*=\s*"([^"]*)"/g;
  let m;
  while ((m = re.exec(tag)) !== null) {
    attrs[m[1]] = unescapeXml(m[2]);
  }
  return attrs;
}

// Parsa l'intero contenuto XML e restituisce un array di chiamate
// normalizzate, pronte per l'upsert su Supabase.
export function parseCallsXml(xml) {
  if (!xml || typeof xml !== 'string') return [];
  const calls = [];
  const tagRe = /<call\b[^>]*\/?>/g;
  let match;
  while ((match = tagRe.exec(xml)) !== null) {
    const attrs = parseAttributes(match[0]);
    if (!attrs.date) continue;

    const epochMs = Number(attrs.date);
    if (!Number.isFinite(epochMs)) continue;

    const type = Number(attrs.type) || 0;
    const number = attrs.number || '';
    const contactName =
      attrs.contact_name && attrs.contact_name !== '(Unknown)'
        ? attrs.contact_name
        : null;

    calls.push({
      // Chiave naturale per il dedup: numero + timestamp esatto (ms).
      external_id: `${digitsOnly(number) || 'na'}_${attrs.date}`,
      number,
      number_normalized: normalizeNumber(number),
      contact_name: contactName,
      duration: Number(attrs.duration) || 0,
      call_date: new Date(epochMs).toISOString(),
      type,
      type_label: TYPE_LABELS[type] || 'sconosciuto',
    });
  }
  return calls;
}

export { TYPE_LABELS };
