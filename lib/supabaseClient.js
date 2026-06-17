'use client';
import { createClient } from '@supabase/supabase-js';

// Fallback inerti per non far crashare il build/prerender quando le env var
// non sono ancora configurate (es. su Vercel). A runtime, se le variabili
// reali sono presenti vengono usate quelle; altrimenti le chiamate falliscono
// in modo controllato invece di interrompere la generazione delle pagine.
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const supabase = createClient(supabaseUrl, supabaseKey);
