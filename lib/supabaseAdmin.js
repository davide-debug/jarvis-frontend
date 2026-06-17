// Client Supabase lato server con service role: usato SOLO nelle API route
// (mai esposto al browser) per scrivere nella tabella calls bypassando la RLS.
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function getSupabaseAdmin() {
  if (!url || !serviceKey) {
    throw new Error(
      'Configurazione Supabase mancante: NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY'
    );
  }
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
