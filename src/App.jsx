import { useState } from 'react'

const sections = {
  home: { title: "🏠 Home", content: "Benvenuto su Jarvis Dashboard 🚀" },
  clients: { title: "👥 Clients", content: "Gestione dei clienti." },
  kanban: { title: "📌 Kanban", content: "Board delle attività." },
  prodotti: { title: "📦 Prodotti", content: "Gestione dei prodotti." },
  costi: { title: "💰 Costi", content: "Analisi e controllo dei costi." },
  obiettivi: { title: "🎯 Obiettivi", content: "Monitoraggio degli obiettivi." },
  realtime: { title: "⚡ Realtime", content: "Dati in tempo reale." },
}

export default function App() {
  const [active, setActive] = useState("home")

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 p-6 flex flex-col">
        <h1 className="text-2xl font-bold mb-6">Jarvis</h1>
        <nav className="space-y-3">
          {Object.keys(sections).map((key) => (
            <button
              key={key}
              onClick={() => setActive(key)}
              className={`block w-full text-left px-3 py-2 rounded-md transition ${
                active === key
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
            >
              {sections[key].title}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-gray-800 flex items-center justify-between px-6 shadow-md">
          <h2 className="text-xl font-semibold">{sections[active].title}</h2>
          <div className="flex items-center space-x-4">
            <button className="hover:text-blue-400">🔔</button>
            <button className="hover:text-blue-400">⚙️</button>
            <div className="w-8 h-8 rounded-full bg-gray-600"></div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-10 overflow-y-auto">
          <p className="text-lg text-gray-300">{sections[active].content}</p>
        </main>
      </div>
    </div>
  )
}
