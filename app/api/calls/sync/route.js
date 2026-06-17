// Endpoint di sincronizzazione del registro chiamate.
//
//   GET  /api/calls/sync   -> scarica l'ultimo backup da Google Drive (per cron)
//   POST /api/calls/sync   -> body con XML caricato a mano, oppure { source:'drive' }
//
// In entrambi i casi: parsa l'XML, collega ogni chiamata al cliente in base al
// numero di telefono, e fa l'upsert (dedup su external_id) nella tabella calls.
import { NextResponse } from 'next/server';
import { parseCallsXml, numbersMatch } from '../../../../lib/parseCalls';
import { getSupabaseAdmin } from '../../../../lib/supabaseAdmin';
import { fetchLatestCallsBackup } from '../../../../lib/googleDrive';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Se CALLS_SYNC_SECRET e' impostato, l'endpoint richiede l'header x-sync-secret.
// Lasciandolo vuoto l'endpoint resta aperto (coerente con la RLS attuale del progetto).
function checkSecret(req) {
  const secret = process.env.CALLS_SYNC_SECRET;
  if (!secret) return true;
  const provided =
    req.headers.get('x-sync-secret') ||
    (req.headers.get('authorization') || '').replace(/^Bearer\s+/i, '');
  return provided === secret;
}

async function syncFromXml(xml, sourceLabel) {
  const calls = parseCallsXml(xml);
  if (calls.length === 0) {
    return { source: sourceLabel, parsed: 0, upserted: 0, matched: 0 };
  }

  const supabase = getSupabaseAdmin();

  // Carica i clienti una volta sola per il matching per numero.
  const { data: clients, error: clientsErr } = await supabase
    .from('clients')
    .select('id, phone');
  if (clientsErr) throw clientsErr;

  let matched = 0;
  for (const call of calls) {
    const client = (clients || []).find(
      (c) => c.phone && numbersMatch(c.phone, call.number)
    );
    call.client_id = client ? client.id : null;
    if (client) matched++;
  }

  // Upsert a blocchi su external_id (dedup tra backup successivi).
  let upserted = 0;
  const chunkSize = 500;
  for (let i = 0; i < calls.length; i += chunkSize) {
    const chunk = calls.slice(i, i + chunkSize);
    const { error } = await supabase
      .from('calls')
      .upsert(chunk, { onConflict: 'external_id', ignoreDuplicates: false });
    if (error) throw error;
    upserted += chunk.length;
  }

  return { source: sourceLabel, parsed: calls.length, upserted, matched };
}

export async function GET(req) {
  if (!checkSecret(req)) {
    return NextResponse.json({ error: 'non autorizzato' }, { status: 401 });
  }
  try {
    const backup = await fetchLatestCallsBackup();
    const result = await syncFromXml(backup.xml, `drive:${backup.name}`);
    return NextResponse.json({ ok: true, ...result });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e.message || e) }, { status: 500 });
  }
}

export async function POST(req) {
  if (!checkSecret(req)) {
    return NextResponse.json({ error: 'non autorizzato' }, { status: 401 });
  }
  try {
    const contentType = req.headers.get('content-type') || '';

    // Caso 1: XML caricato direttamente (text/xml o testo grezzo).
    if (contentType.includes('xml') || contentType.includes('text/plain')) {
      const xml = await req.text();
      const result = await syncFromXml(xml, 'upload');
      return NextResponse.json({ ok: true, ...result });
    }

    // Caso 2: JSON. { xml: "..." } oppure { source: "drive" }.
    let body = {};
    try {
      body = await req.json();
    } catch (_) {
      body = {};
    }

    if (body.xml) {
      const result = await syncFromXml(body.xml, 'upload');
      return NextResponse.json({ ok: true, ...result });
    }

    const backup = await fetchLatestCallsBackup();
    const result = await syncFromXml(backup.xml, `drive:${backup.name}`);
    return NextResponse.json({ ok: true, ...result });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e.message || e) }, { status: 500 });
  }
}
