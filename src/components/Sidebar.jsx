export default function Sidebar({ active, setActive }) {
  const menuItems = [
    { key: 'dashboard', label: '📊 Dashboard' },
    { key: 'clients', label: '👥 Clients' },
    { key: 'kanban', label: '📌 Kanban' },
    { key: 'prodotti', label: '📦 Prodotti' },
    { key: 'costi', label: '💰 Costi' },
    { key: 'obiettivi', label: '🎯 Obiettivi' },
    { key: 'realtime', label: '⚡ Realtime' },
  ]

  return (
    <aside className="w-64 bg-gray-800 p-6 flex flex-col">
      <h1 className="text-2xl font-bold mb-6">Jarvis</h1>
      <nav className="space-y-3">
        {menuItems.map(item => (
          <button
            key={item.key}
            onClick={() => setActive(item.key)}
            className={`block w-full text-left px-3 py-2 rounded-md transition ${
              active === item.key
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  )
}
