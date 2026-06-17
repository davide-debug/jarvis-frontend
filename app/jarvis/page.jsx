'use client';
import { useEffect, useRef, useState } from 'react';

// Conversazione vocale continua con Jarvis.
// Usa le Web Speech API native del browser:
//   - SpeechRecognition  -> voce in (parli)
//   - speechSynthesis    -> voce out (Jarvis risponde)
// Le risposte arrivano da /api/chat (LLM gratis, es. Groq; vedi route.js).
// Supporto migliore su Chrome/Edge desktop.

export default function JarvisVoicePage() {
  const [supported, setSupported] = useState(true);
  const [active, setActive] = useState(false);
  const [status, setStatus] = useState('Premi "Avvia" e inizia a parlare.');
  const [interim, setInterim] = useState('');
  const [messages, setMessages] = useState([]);

  const recognitionRef = useRef(null);
  const activeRef = useRef(false); // sessione di conversazione accesa?
  const busyRef = useRef(false); // stiamo elaborando/parlando? (mic in pausa)
  const messagesRef = useRef([]); // storia per la closure dei callback

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    const SR =
      typeof window !== 'undefined' &&
      (window.SpeechRecognition || window.webkitSpeechRecognition);
    if (!SR) {
      setSupported(false);
      return;
    }
    return () => stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function buildRecognition() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SR();
    rec.lang = 'it-IT';
    rec.continuous = true;
    rec.interimResults = true;

    rec.onresult = (event) => {
      if (busyRef.current) return; // ignora l'eco di Jarvis mentre parla
      let finalText = '';
      let interimText = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const r = event.results[i];
        if (r.isFinal) finalText += r[0].transcript;
        else interimText += r[0].transcript;
      }
      setInterim(interimText);
      const utterance = finalText.trim();
      if (utterance) {
        setInterim('');
        handleUserUtterance(utterance);
      }
    };

    rec.onerror = (e) => {
      if (e.error === 'no-speech' || e.error === 'aborted') return;
      if (e.error === 'not-allowed') {
        setStatus('Permesso microfono negato. Abilitalo nel browser.');
        stop();
        return;
      }
      setStatus(`Errore riconoscimento: ${e.error}`);
    };

    rec.onend = () => {
      // Riavvia se la sessione è ancora attiva e non stiamo già parlando.
      if (activeRef.current && !busyRef.current) {
        safeStart();
      }
    };

    return rec;
  }

  function safeStart() {
    try {
      recognitionRef.current?.start();
      if (activeRef.current && !busyRef.current) {
        setStatus('In ascolto…');
      }
    } catch {
      /* start() può lanciare se già avviato: ignora */
    }
  }

  function start() {
    if (!supported) return;
    recognitionRef.current = buildRecognition();
    activeRef.current = true;
    busyRef.current = false;
    setActive(true);
    safeStart();
  }

  function stop() {
    activeRef.current = false;
    busyRef.current = false;
    setActive(false);
    setInterim('');
    try {
      window.speechSynthesis?.cancel();
    } catch {}
    try {
      recognitionRef.current?.stop();
    } catch {}
    recognitionRef.current = null;
    setStatus('Conversazione terminata.');
  }

  async function handleUserUtterance(text) {
    busyRef.current = true; // metti il mic in pausa durante elaborazione + risposta
    try {
      recognitionRef.current?.stop();
    } catch {}

    const userMsg = { role: 'user', content: text };
    const history = [...messagesRef.current, userMsg];
    setMessages(history);
    setStatus('Jarvis sta pensando…');

    let reply = '';
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      });
      const data = await res.json();
      reply = data?.reply || data?.error || 'Non ho una risposta.';
    } catch {
      reply = 'Errore di rete nel contattare Jarvis.';
    }

    setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    speak(reply);
  }

  function speak(text) {
    const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    const resume = () => {
      busyRef.current = false;
      if (activeRef.current) safeStart();
    };

    if (!synth || !('SpeechSynthesisUtterance' in window)) {
      resume();
      return;
    }

    setStatus('Jarvis sta parlando…');
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'it-IT';
    u.rate = 1.05;
    u.onend = resume;
    u.onerror = resume;
    synth.cancel();
    synth.speak(u);
  }

  if (!supported) {
    return (
      <div className="card">
        <h3 className="text-xl font-semibold mb-2">🎙️ Jarvis Voce</h3>
        <p className="text-gray-300">
          Il tuo browser non supporta il riconoscimento vocale. Prova con Chrome
          o Edge su desktop.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 max-w-3xl">
      <div className="card">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h3 className="text-xl font-semibold mb-1">🎙️ Parla con Jarvis</h3>
            <p className="text-gray-400 text-sm">{status}</p>
          </div>
          <div className="flex items-center gap-3">
            {active && (
              <span className="flex items-center gap-2 text-sm text-green-400">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
                </span>
                live
              </span>
            )}
            {!active ? (
              <button onClick={start}>Avvia conversazione</button>
            ) : (
              <button
                className="bg-red-600 hover:bg-red-700"
                onClick={stop}
              >
                Stop
              </button>
            )}
          </div>
        </div>
        {interim && (
          <p className="mt-3 text-gray-400 italic">“{interim}”</p>
        )}
      </div>

      <div className="card">
        <h4 className="text-lg font-semibold mb-3">Conversazione</h4>
        <ul className="space-y-3">
          {messages.map((m, i) => (
            <li
              key={i}
              className={
                m.role === 'user'
                  ? 'bg-blue-600/20 border border-blue-600/40 p-3 rounded-xl'
                  : 'bg-gray-700 p-3 rounded-xl'
              }
            >
              <span className="block text-xs uppercase tracking-wide text-gray-400 mb-1">
                {m.role === 'user' ? 'Tu' : 'Jarvis'}
              </span>
              {m.content}
            </li>
          ))}
          {messages.length === 0 && (
            <li className="text-gray-400">
              Nessun messaggio ancora. Avvia e di' qualcosa, tipo “Ciao Jarvis”.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
