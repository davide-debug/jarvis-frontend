'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function Page() {
  const [logs, setLogs] = useState([]);
  const [message, setMessage] = useState('');

  const load = async () => {
    const { data } = await supabase.from('logs').select('*').order('created_at',{ascending:false}).limit(50);
    setLogs(data || []);
  };

  useEffect(() => {
    load();
    const channel = supabase
      .channel('logs')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'logs' }, (payload) => {
        setLogs((prev) => [payload.new, ...prev].slice(0,50));
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const send = async (e) => {
    e.preventDefault();
    if(!message.trim()) return;
    await supabase.from('logs').insert({ message });
    setMessage('');
  };

  return (
    <div className="grid gap-6">
      <div className="card">
        <h3 className="text-xl font-semibold mb-4">Invia Evento</h3>
        <form onSubmit={send} className="flex gap-3">
          <input placeholder="Messaggio" value={message} onChange={e=>setMessage(e.target.value)} />
          <button>Invia</button>
        </form>
      </div>
      <div className="card">
        <h3 className="text-xl font-semibold mb-4">Stream Realtime</h3>
        <ul className="space-y-2">
          {logs.map(l => (
            <li key={l.id} className="bg-gray-700 p-2 rounded">{l.created_at?.slice(11,19)} — {l.message}</li>
          ))}
          {logs.length===0 && <li className="text-gray-400">Nessun evento.</li>}
        </ul>
      </div>
    </div>
  )
}
