'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import ConfirmDialog from '../../components/ConfirmDialog';

export default function Page() {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name:'', description:'', price:'' });

  const load = async () => {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    setItems(data || []);
  };
  useEffect(()=>{ load(); }, []);

  const add = async (e) => {
    e.preventDefault();
    const price = form.price ? parseFloat(form.price) : null;
    await supabase.from('products').insert({ name: form.name, description: form.description, price });
    setForm({ name:'', description:'', price:'' });
    load();
  };
  const del = async (id) => { setPendingDeleteId(id); setConfirmOpen(true); }; // open modal instead of immediate delete await supabase.from('products').delete().eq('id', id); load(); };

  
  const confirmDeletion = async () => {
    if(!pendingDeleteId) return;
    await supabase.from(products).delete().eq('id', pendingDeleteId);
    setPendingDeleteId(null);
    setConfirmOpen(false);
    load();
  };

  return (
    <div className="grid gap-6">
      <div className="card">
        <h3 className="text-xl font-semibold mb-4">Aggiungi Prodotto</h3>
        <form onSubmit={add} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input placeholder="Nome *" required value={form.name} onChange={e=>setForm({...form, name:e.target.value})}/>
          <input placeholder="Prezzo" value={form.price} onChange={e=>setForm({...form, price:e.target.value})}/>
          <input placeholder="Descrizione" className="md:col-span-2" value={form.description} onChange={e=>setForm({...form, description:e.target.value})}/>
          <div><button>Salva</button></div>
        </form>
      </div>
      <div className="card">
        <h3 className="text-xl font-semibold mb-4">Elenco Prodotti</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-300">
                <th className="p-2">Nome</th>
                <th className="p-2">Prezzo</th>
                <th className="p-2">Descrizione</th>
                <th className="p-2">Azioni</th>
              </tr>
            </thead>
            <tbody>
              {items.map(i => (
                <tr key={i.id} className="border-t border-gray-700">
                  <td className="p-2">{i.name}</td>
                  <td className="p-2">{i.price ?? '-'}</td>
                  <td className="p-2">{i.description}</td>
                  <td className="p-2"><button className="bg-red-600 hover:bg-red-700" onClick={()=>del(i.id)}>Elimina</button></td>
                </tr>
              ))}
              {items.length===0 && <tr><td className="p-2 text-gray-400" colSpan="4">Nessun prodotto.</td></tr>}
            </tbody>
          </table>
        </div>
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
