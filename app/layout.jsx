import Link from "next/link"

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head />
      <body style={{ display: "flex", minHeight: "100vh", margin: 0 }}>
        {/* Sidebar */}
        <nav style={{ 
          width: "200px", 
          background: "#111", 
          color: "#fff", 
          padding: "20px" 
        }}>
          <h2>Jarvis</h2>
          <ul style={{ listStyle: "none", padding: 0 }}>
            <li><Link href="/">🏠 Home</Link></li>
            <li><Link href="/clients">👥 Clients</Link></li>
            <li><Link href="/kanban">📌 Kanban</Link></li>
            <li><Link href="/prodotti">📦 Prodotti</Link></li>
            <li><Link href="/costi">💰 Costi</Link></li>
            <li><Link href="/obiettivi">🎯 Obiettivi</Link></li>
            <li><Link href="/realtime">⚡ Realtime</Link></li>
          </ul>
        </nav>

        {/* Contenuto principale */}
        <main style={{ flex: 1, padding: "20px" }}>
          {children}
        </main>
      </body>
    </html>
  )
}
