import { NextResponse } from 'next/server';

// Route provider-agnostica (compatibile OpenAI).
// Default: Groq (gratis, bassa latenza -> ideale per la voce).
// Per usare un altro provider basta cambiare le env:
//   LLM_API_KEY   -> la tua API key
//   LLM_BASE_URL  -> es. https://api.groq.com/openai/v1 (default)
//                    Gemini (OpenAI-compatible): https://generativelanguage.googleapis.com/v1beta/openai
//   LLM_MODEL     -> es. llama-3.3-70b-versatile (Groq) / gemini-2.0-flash (Gemini)
// Se LLM_API_KEY non è impostata, risponde in modalità "eco/demo" così la pagina funziona comunque.

export const runtime = 'edge';

const SYSTEM_PROMPT =
  "Sei Jarvis, l'assistente vocale della dashboard. Rispondi in italiano, in modo " +
  "conciso e naturale, con frasi brevi adatte a essere lette ad alta voce. " +
  'Niente markdown, elenchi puntati o emoji: solo testo parlato.';

export async function POST(req) {
  let messages = [];
  try {
    const body = await req.json();
    messages = Array.isArray(body?.messages) ? body.messages : [];
  } catch {
    return NextResponse.json({ error: 'Body non valido' }, { status: 400 });
  }

  const apiKey = process.env.LLM_API_KEY || process.env.GROQ_API_KEY;
  const baseUrl = process.env.LLM_BASE_URL || 'https://api.groq.com/openai/v1';
  const model = process.env.LLM_MODEL || 'llama-3.3-70b-versatile';

  // Fallback eco/demo: nessuna API key configurata.
  if (!apiKey) {
    const last = [...messages].reverse().find((m) => m.role === 'user');
    const reply = last?.content
      ? `Modalità demo: hai detto "${last.content}". Imposta LLM_API_KEY per attivare le risposte AI.`
      : 'Modalità demo attiva. Imposta LLM_API_KEY per parlare con un modello vero.';
    return NextResponse.json({ reply, demo: true });
  }

  try {
    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.6,
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      return NextResponse.json(
        { error: 'Errore dal provider LLM', detail },
        { status: 502 }
      );
    }

    const data = await res.json();
    const reply = data?.choices?.[0]?.message?.content?.trim() || '...';
    return NextResponse.json({ reply });
  } catch (err) {
    return NextResponse.json(
      { error: 'Impossibile contattare il provider LLM', detail: String(err) },
      { status: 502 }
    );
  }
}
