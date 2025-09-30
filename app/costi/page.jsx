'use client';
import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import ConfirmDialog from '../../components/ConfirmDialog';

export default function Page() {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState({ description:'', amount:'', category:'', period:'' });

  const load = async () => {
    const { data } = await supabase.from('costs').select('*').order('period', { ascending: false });
    setRows(data || []);
  };
  useEffect(()=>{ load(); }, []);

  const add = async (e) => {
    e.preventDefault();
    const payload = {
      description: form.description,
      amount: form.amount ? parseFloat(form.amount) : null,
      category: form.category || null,
      period: form.period || null
    };
    await supabase.from('costs').insert(payload);
    setForm({ description:'', amount:'', category:'', period:'' });
    load();
  };

  const del = async (id) => { setPendingDeleteId(id); setConfirmOpen(true); }; // open modal instead of immediate delete await supabase.from('costs').delete().eq('id', id); load(); };

  const totals = useMemo(() => {
    const byMonth = {};
    for(const r of rows){
      const key = r.period ? r.period.slice(0,7) : 'N/D';
      byMonth[key] = (byMonth[key] || 0) + (r.amount || 0);
    }
    return byMonth;
  }, [rows]);

  
  const confirmDeletion = async () => {
    if(!pendingDeleteId) return;
    await supabase.from(costs).delete().eq('id', pendingDeleteId);
    setPendingDeleteId(null);
    setConfirmOpen(false);
    load();
  };

  return (
    <div className="grid gap-6">
      <div className="card">
        <h3 className="text-xl font-semibold mb-4">Aggiungi Costo</h3>
        <form onSubmit={add} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input placeholder="Descrizione *" required value={form.description} onChange={e=>setForm({...form, description:e.target.value})}/>
          <input placeholder="Importo € *" required value={form.amount} onChange={e=>setForm({...form, amount:e.target.value})}/>
          <input placeholder="Categoria" value={form.category} onChange={e=>setForm({...form, category:e.target.value})}/>
          <input type="date" value={form.period} onChange={e=>setForm({...form, period:e.target.value})}/>
          <div><button>Salva</button></div>
        </form>
      </div>

      <div className="card">
        <h3 className="text-xl font-semibold mb-4">Elenco Costi</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-300">
                <th className="p-2">Periodo</th>
                <th className="p-2">Descrizione</th>
                <th className="p-2">Categoria</th>
                <th className="p-2">Importo</th>
                <th className="p-2">Azioni</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.id} className="border-t border-gray-700">
                  <td className="p-2">{r.period?.slice(0,10) || '-'}</td>
                  <td className="p-2">{r.description}</td>
                  <td className="p-2">{r.category || '-'}</td>
                  <td className="p-2">€ {Number(r.amount||0).toFixed(2)}</td>
                  <td className="p-2"><button className="bg-red-600 hover:bg-red-700" onClick={()=>del(r.id)}>Elimina</button></td>
                </tr>
              ))}
              {rows.length===0 && <tr><td className="p-2 text-gray-400" colSpan="5">Nessun costo.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <h3 className="text-xl font-semibold mb-2">Totali per mese</h3>
        <ul className="list-disc pl-5 text-gray-300">
          {Object.entries(totals).map(([m,tot]) => (
            <li key={m}>{m}: € {tot.toFixed(2)}</li>
          ))}
          {Object.keys(totals).length===0 && <li>Nessun dato.</li>}
        </ul>
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
