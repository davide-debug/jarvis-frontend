export default function Dashboard() {
  const cards = [
    { title: '📅 Prossime Call', content: 'Nessuna call programmata.' },
    { title: '📊 KPI Principali', content: 'Conversion rate: 25% - Crescita: +12%' },
    { title: '📝 Task in corso', content: '3 attività ancora da completare.' },
    { title: '💰 Costi Stimati', content: 'Totale mese: € 4.200' },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
      {cards.map((card, idx) => (
        <div key={idx} className="bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
          <p className="text-gray-300">{card.content}</p>
        </div>
      ))}
    </div>
  )
}
