import Link from "next/link";
import "../styles/globals.css";

export const metadata = { title: "Jarvis Dashboard" };

export default function RootLayout({ children }) {
  return (
    <html lang="it" className="dark">
      <body className="flex h-screen">
        <aside className="w-64 bg-gray-800 p-6 flex flex-col">
          <h1 className="text-2xl font-bold mb-6">Jarvis</h1>
          <nav className="space-y-3">
            <Link href="/" className="block hover:text-blue-400">📊 Dashboard</Link>
            <Link href="/jarvis" className="block hover:text-blue-400">🎙️ Parla con Jarvis</Link>
            <Link href="/clients" className="block hover:text-blue-400">👥 Clients</Link>
            <Link href="/kanban" className="block hover:text-blue-400">📌 Kanban</Link>
            <Link href="/prodotti" className="block hover:text-blue-400">📦 Prodotti</Link>
            <Link href="/costi" className="block hover:text-blue-400">💶 Costi</Link>
            <Link href="/obiettivi" className="block hover:text-blue-400">🎯 Obiettivi</Link>
            <Link href="/realtime" className="block hover:text-blue-400">⚡ Realtime</Link>
          </nav>
          <div className="mt-auto text-xs text-gray-400 pt-6 border-t border-gray-700">
            Next.js 14 • Tailwind • Supabase
          </div>
        </aside>

        <div className="flex-1 flex flex-col">
          <header className="h-16 bg-gray-800 flex items-center justify-between px-6 shadow-md">
            <h2 className="text-xl font-semibold">Jarvis Dashboard</h2>
            <div className="flex items-center gap-4">
              <button className="hover:text-blue-400" title="Notifiche">🔔</button>
              <button className="hover:text-blue-400" title="Impostazioni">⚙️</button>
              <div className="w-8 h-8 rounded-full bg-gray-600" title="Utente"></div>
            </div>
          </header>
          <main className="flex-1 p-6 overflow-y-auto">{children}</main>
        </div>
      </body>
    </html>
  );
}
