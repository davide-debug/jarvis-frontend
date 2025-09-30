'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import ConfirmDialog from '../../components/ConfirmDialog';

export default function Page() {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ title:'', progress:0, deadline:'' });

  const load = async () => { 
    const { data } = await supabase.from('goals').select('*').order('created_at',{ascending:false}); 
    setItems(data||[]); 
  };
  useEffect(()=>{ load(); }, []);

  const add = async (e) => {
    e.preventDefault();
    await supabase.from('goals').insert({ title: form.title, progress: Number(form.progress||0), deadline: form.deadline || null });
    setForm({ title:'', progress:0, deadline:'' });
    load();
  };

  const del = async (id) => { setPendingDeleteId(id); setConfirmOpen(true); }; // open modal instead of immediate delete await supabase.from('goals').delete().eq('id', id); load(); };

  
  const confirmDeletion = async () => {
    if(!pendingDeleteId) return;
    await supabase.from(goals).delete().eq('id', pendingDeleteId);
    setPendingDeleteId(null);
    setConfirmOpen(false);
    load();
  };

  return (
    <div className="grid gap-6">
      <div className="card">
        <h3 className="text-xl font-semibold mb-4">Nuovo Obiettivo</h3>
        <form onSubmit={add} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input placeholder="Titolo *" required value={form.title} onChange={e=>setForm({...form, title:e.target.value})}/>
          <input type="number" min="0" max="100" placeholder="% completamento" value={form.progress} onChange={e=>setForm({...form, progress:e.target.value})}/>
          <input type="date" value={form.deadline} onChange={e=>setForm({...form, deadline:e.target.value})}/>
          <div><button>Salva</button></div>
        </form>
      </div>
      <div className="grid-cards">
        {items.map(g => (
          <div key={g.id} className="card">
            <h4 className="font-semibold mb-2">{g.title}</h4>
            <div className="w-full bg-gray-700 rounded h-3 mb-2">
              <div className="bg-green-500 h-3 rounded" style={{width:`${g.progress||0}%`}} />
            </div>
            <div className="text-gray-300 text-sm flex justify-between">
              <span>{g.progress || 0}%</span>
              <span>{g.deadline?.slice(0,10) || '-'}</span>
            </div>
            <div className="mt-3"><button className="bg-red-600 hover:bg-red-700" onClick={()=>del(g.id)}>Elimina</button></div>
          </div>
        ))}
        {items.length===0 && <div className="text-gray-400">Nessun obiettivo.</div>}
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
