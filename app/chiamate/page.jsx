'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

const TYPE_META = {
  in_entrata: { label: 'In entrata', icon: '📥', color: 'text-green-400' },
  in_uscita: { label: 'In uscita', icon: '📤', color: 'text-blue-400' },
  persa: { label: 'Persa', icon: '⚠️', color: 'text-yellow-400' },
  segreteria: { label: 'Segreteria', icon: '📨', color: 'text-purple-400' },
  rifiutata: { label: 'Rifiutata', icon: '⛔', color: 'text-red-400' },
  bloccata: { label: 'Bloccata', icon: '🚫', color: 'text-gray-400' },
  sconosciuto: { label: 'Sconosciuto', icon: '❓', color: 'text-gray-400' },
};

function formatDuration(s) {
  if (!s) return '—';
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return m > 0 ? `${m}m ${sec}s` : `${sec}s`;
}

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (_) {
    return iso;
  }
}

export default function Page() {
  const [calls, setCalls] = useState([]);
  const [filterType, setFilterType] = useState('');
  const [search, setSearch] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  const load = async () => {
    let query = supabase
      .from('calls')
      .select('*, clients(name, company)')
      .order('call_date', { ascending: false })
      .limit(300);
    if (filterType) query = query.eq('type_label', filterType);
    const { data, error } = await query;
    if (!error) setCalls(data || []);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterType]);

  const syncFromDrive = async () => {
    setBusy(true);
    setMsg('Sincronizzazione da Google Drive in corso…');
    try {
      const res = await fetch('/api/calls/sync', { method: 'GET' });
      const data = await res.json();
      if (data.ok) {
        setMsg(
          `✅ ${data.parsed} chiamate dal backup (${data.source}) — ${data.matched} collegate a clienti.`
        );
        load();
      } else {
        setMsg(`❌ Errore: ${data.error}`);
      }
    } catch (e) {
      setMsg(`❌ Errore di rete: ${String(e)}`);
    } finally {
      setBusy(false);
    }
  };

  const uploadFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setMsg(`Carico ${file.name}…`);
    try {
      const xml = await file.text();
      const res = await fetch('/api/calls/sync', {
        method: 'POST',
        headers: { 'content-type': 'text/xml' },
        body: xml,
      });
      const data = await res.json();
      if (data.ok) {
        setMsg(`✅ ${data.parsed} chiamate importate — ${data.matched} collegate a clienti.`);
        load();
      } else {
        setMsg(`❌ Errore: ${data.error}`);
      }
    } catch (err) {
      setMsg(`❌ Errore: ${String(err)}`);
    } finally {
      setBusy(false);
      e.target.value = '';
    }
  };

  const filtered = calls.filter((c) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      (c.number || '').toLowerCase().includes(q) ||
      (c.contact_name || '').toLowerCase().includes(q) ||
      (c.clients?.name || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="grid gap-6">
      <div className="card">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold">Registro Chiamate</h3>
            <p className="text-gray-400 text-sm">
              Sincronizzato dal backup del telefono (SMS Backup &amp; Restore → Google Drive).
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button onClick={syncFromDrive} disabled={busy}>
              {busy ? 'Attendi…' : '🔄 Sincronizza da Drive'}
            </button>
            <label className="bg-gray-700 hover:bg-gray-600 transition rounded-xl px-4 py-2 cursor-pointer text-sm">
              📁 Carica XML
              <input
                type="file"
                accept=".xml,text/xml"
                onChange={uploadFile}
                disabled={busy}
                className="hidden"
              />
            </label>
          </div>
        </div>
        {msg && <p className="mt-3 text-sm text-gray-300">{msg}</p>}
      </div>

      <div className="card">
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex-1 min-w-[200px]">
            <input
              placeholder="Cerca numero, contatto o cliente…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="w-48">
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              <option value="">Tutti i tipi</option>
              <option value="in_entrata">In entrata</option>
              <option value="in_uscita">In uscita</option>
              <option value="persa">Perse</option>
              <option value="rifiutata">Rifiutate</option>
              <option value="bloccata">Bloccate</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-300">
                <th className="p-2">Data/Ora</th>
                <th className="p-2">Tipo</th>
                <th className="p-2">Numero</th>
                <th className="p-2">Contatto / Cliente</th>
                <th className="p-2">Durata</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => {
                const meta = TYPE_META[c.type_label] || TYPE_META.sconosciuto;
                return (
                  <tr key={c.id} className="border-t border-gray-700">
                    <td className="p-2 whitespace-nowrap">{formatDate(c.call_date)}</td>
                    <td className={`p-2 whitespace-nowrap ${meta.color}`}>
                      {meta.icon} {meta.label}
                    </td>
                    <td className="p-2 whitespace-nowrap">{c.number}</td>
                    <td className="p-2">
                      {c.clients?.name ? (
                        <span className="text-blue-400">
                          👤 {c.clients.name}
                          {c.clients.company ? ` · ${c.clients.company}` : ''}
                        </span>
                      ) : (
                        c.contact_name || <span className="text-gray-500">—</span>
                      )}
                    </td>
                    <td className="p-2 whitespace-nowrap">{formatDuration(c.duration)}</td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td className="p-2 text-gray-400" colSpan="5">
                    Nessuna chiamata. Usa “Sincronizza da Drive” o “Carica XML”.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
