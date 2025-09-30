import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import Clients from './components/Clients'
import Kanban from './components/Kanban'
import Prodotti from './components/Prodotti'
import Costi from './components/Costi'
import Obiettivi from './components/Obiettivi'
import Realtime from './components/Realtime'

const sections = {
  dashboard: <Dashboard />,
  clients: <Clients />,
  kanban: <Kanban />,
  prodotti: <Prodotti />,
  costi: <Costi />,
  obiettivi: <Obiettivi />,
  realtime: <Realtime />,
}

export default function App() {
  const [active, setActive] = useState('dashboard')

  return (
    <div className="flex h-screen">
      <Sidebar active={active} setActive={setActive} />
      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-gray-800 flex items-center justify-between px-6 shadow-md">
          <h2 className="text-xl font-semibold capitalize">{active}</h2>
          <div className="flex items-center space-x-4">
            <button className="hover:text-blue-400">🔔</button>
            <button className="hover:text-blue-400">⚙️</button>
            <div className="w-8 h-8 rounded-full bg-gray-600"></div>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-y-auto">
          {sections[active]}
        </main>
      </div>
    </div>
  )
}
