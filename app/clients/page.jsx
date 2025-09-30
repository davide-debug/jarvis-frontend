'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import ConfirmDialog from '../../components/ConfirmDialog';

export default function Page() {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name:'', company:'', email:'', phone:'', notes:'' });
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const { data, error } = await supabase.from('clients').select('*').order('created_at', { ascending: false });
    if (!error) setItems(data || []);
  };

  useEffect(() => { load(); }, []);

  const add = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from('clients').insert(form);
    setLoading(false);
    if (!error) { setForm({ name:'', company:'', email:'', phone:'', notes:'' }); load(); }
  };

  const del = async (id) => { setPendingDeleteId(id); setConfirmOpen(true); }; // open modal instead of immediate delete await supabase.from('clients').delete().eq('id', id); load(); };

  
  const confirmDeletion = async () => {
    if(!pendingDeleteId) return;
    await supabase.from(clients).delete().eq('id', pendingDeleteId);
    setPendingDeleteId(null);
    setConfirmOpen(false);
    load();
  };

  return (
    <div className="grid gap-6">
      <div className="card">
        <h3 className="text-xl font-semibold mb-4">Aggiungi Cliente</h3>
        <form onSubmit={add} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input placeholder="Nome *" required value={form.name} onChange={e=>setForm({...form, name:e.target.value})}/>
          <input placeholder="Azienda" value={form.company} onChange={e=>setForm({...form, company:e.target.value})}/>
          <input placeholder="Email" type="email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})}/>
          <input placeholder="Telefono" value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})}/>
          <textarea placeholder="Note" className="md:col-span-2" value={form.notes} onChange={e=>setForm({...form, notes:e.target.value})}/>
          <div><button disabled={loading}>{loading ? 'Salvo…' : 'Salva'}</button></div>
        </form>
      </div>
      <div className="card">
        <h3 className="text-xl font-semibold mb-4">Elenco Clienti</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-300">
                <th className="p-2">Nome</th>
                <th className="p-2">Azienda</th>
                <th className="p-2">Email</th>
                <th className="p-2">Telefono</th>
                <th className="p-2">Azioni</th>
              </tr>
            </thead>
            <tbody>
              {items.map(i => (
                <tr key={i.id} className="border-t border-gray-700">
                  <td className="p-2">{i.name}</td>
                  <td className="p-2">{i.company}</td>
                  <td className="p-2">{i.email}</td>
                  <td className="p-2">{i.phone}</td>
                  <td className="p-2">
                    <button className="bg-red-600 hover:bg-red-700" onClick={()=>del(i.id)}>Elimina</button>
                  </td>
                </tr>
              ))}
              {items.length===0 && <tr><td className="p-2 text-gray-400" colSpan="5">Nessun cliente.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
