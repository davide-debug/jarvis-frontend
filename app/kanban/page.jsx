'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import ConfirmDialog from '../../components/ConfirmDialog';

const columns = [
  { key:'todo', title:'To Do' },
  { key:'inprogress', title:'In Progress' },
  { key:'done', title:'Done' },
];

export default function Page() {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');

  const load = async () => {
    const { data } = await supabase.from('tasks').select('*').order('created_at', { ascending: false });
    setTasks(data || []);
  };

  useEffect(()=>{ load(); }, []);

  const add = async (e) => {
    e.preventDefault();
    if(!title.trim()) return;
    await supabase.from('tasks').insert({ title, status: 'todo' });
    setTitle('');
    load();
  };

  const move = async (id, status) => {
    await supabase.from('tasks').update({ status }).eq('id', id);
    load();
  };

  return (
    <div className="grid gap-6">
      <div className="card">
        <h3 className="text-xl font-semibold mb-4">Nuovo Task</h3>
        <form onSubmit={add} className="flex gap-3">
          <input placeholder="Titolo task" value={title} onChange={e=>setTitle(e.target.value)} />
          <button>Aggiungi</button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {columns.map(col => (
          <div key={col.key} className="card">
            <h4 className="font-semibold mb-3">{col.title}</h4>
            <div className="space-y-2">
              {tasks.filter(t=>t.status===col.key).map(t => (
                <div key={t.id} className="bg-gray-700 p-3 rounded flex items-center justify-between">
                  <span>{t.title}</span>
                  <div className="flex gap-2">
                    {columns.filter(c=>c.key!==t.status).map(c => (
                      <button key={c.key} className="bg-gray-600 hover:bg-gray-500" onClick={()=>move(t.id, c.key)}>{c.title}</button>
                    ))}
                  </div>
                </div>
              ))}
              {tasks.filter(t=>t.status===col.key).length===0 && <p className="text-gray-400">Nessun task.</p>}
            </div>
          </div>
        ))}
      </div>
      <ConfirmDialog
        open={confirmOpen}
        title="Confermi l'eliminazione?"
        description="Questa azione non è reversibile."
        confirmText="Elimina"
        cancelText="Annulla"
        onConfirm={confirmDeletion}
        onCancel={()=>{ setPendingDeleteId(null); setConfirmOpen(false); }}
      />

    </div>
      <ConfirmDialog
        open={confirmOpen}
        title="Confermi l'eliminazione?"
        description="Questa azione non è reversibile."
        confirmText="Elimina"
        cancelText="Annulla"
        onConfirm={confirmDeletion}
        onCancel={()=>{ setPendingDeleteId(null); setConfirmOpen(false); }}
      />

  )
}
