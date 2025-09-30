export default function Page() {
  return (
    <div className="grid-cards">
      <div className="card">
        <h3 className="text-xl font-semibold mb-2">Benvenuto</h3>
        <p className="text-gray-300">Questa è la tua dashboard Jarvis 🚀</p>
      </div>
      <div className="card">
        <h3 className="text-xl font-semibold mb-2">Dati</h3>
        <p className="text-gray-300">Pronti a collegare i dati (Supabase).</p>
      </div>
      <div className="card">
        <h3 className="text-xl font-semibold mb-2">Kanban</h3>
        <p className="text-gray-300">Integra Kanban per vedere i task qui.</p>
      </div>
      <div className="card">
        <h3 className="text-xl font-semibold mb-2">KPI</h3>
        <p className="text-gray-300">Totali e trend mensili.</p>
      </div>
    </div>
  );
}
