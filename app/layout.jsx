import Link from "next/link"
import "./globals.css"

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head />
      <body className="flex min-h-screen">
        {/* Sidebar */}
        <nav className="w-56 bg-gray-900 text-white p-5">
          <h2 className="text-2xl font-bold mb-6">Jarvis</h2>
          <ul className="space-y-3">
            <li><Link href="/" className="hover:text-blue-400">🏠 Home</Link></li>
            <li><Link href="/clients" className="hover:text-blue-400">👥 Clients</Link></li>
            <li><Link href="/kanban" className="hover:text-blue-400">📌 Kanban</Link></li>
            <li><Link href="/prodotti" className="hover:text-blue-400">📦 Prodotti</Link></li>
            <li><Link href="/costi" className="hover:text-blue-400">💰 Costi</Link></li>
            <li><Link href="/obiettivi" className="hover:text-blue-400">🎯 Obiettivi</Link></li>
            <li><Link href="/realtime" className="hover:text-blue-400">⚡ Realtime</Link></li>
          </ul>
        </nav>

        {/* Contenuto principale */}
        <main className="flex-1 p-10 bg-white shadow-lg m-5 rounded-xl">
          {children}
        </main>
      </body>
    </html>
  )
}
