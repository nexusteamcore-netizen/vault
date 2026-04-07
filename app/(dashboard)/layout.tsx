'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { LayoutDashboard, KeyRound, Activity, Cpu, Settings, Book, LifeBuoy, KeySquare } from 'lucide-react'

const NAV = [
  { href: '/dashboard', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
  { href: '/vault', icon: <KeyRound size={18} />, label: 'Vault' },
  { href: '/logs', icon: <Activity size={18} />, label: 'Access Logs' },
  { href: '/mcp', icon: <Cpu size={18} />, label: 'MCP Integration' },
  { href: '/settings', icon: <Settings size={18} />, label: 'Settings' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [loggingOut, setLoggingOut] = useState(false)
  const [booting, setBooting] = useState(true)

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/me')
        if (!res.ok) router.push('/login')
      } catch {
        router.push('/login')
      } finally {
        setBooting(false)
      }
    }
    checkAuth()
  }, [router])

  async function handleLogout() {
    setLoggingOut(true)
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  return (
    <div className="shell dashboard-theme">
      {booting && (
        <div className="boot-screen">
          <div className="boot-text mono">
            <span>INIT_VAULT_SYSTEM...</span>
            <span className="blink">_</span>
          </div>
        </div>
      )}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-mark"><KeySquare size={20} color="black" fill="var(--accent)" /></div>
          <div className="sidebar-logo-text typewriter" style={{ maxWidth: 80, animationDelay: '0.5s' }}>Vaultix</div>
          <span className="sidebar-logo-badge">Beta</span>
        </div>

        <nav className="sidebar-nav">
          <span className="nav-label">Workspace</span>
          {NAV.map(item => (
            <Link key={item.href} href={item.href} className={`nav-item ${pathname === item.href ? 'active' : ''}`}>
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </Link>
          ))}

          <span className="nav-label" style={{ marginTop: 12 }}>Resources</span>
          <a href="https://github.com" target="_blank" rel="noreferrer" className="nav-item">
            <span className="nav-icon"><Book size={18} /></span>Docs
          </a>
          <a href="mailto:support@vaultix.dev" className="nav-item">
            <span className="nav-icon"><LifeBuoy size={18} /></span>Support
          </a>
        </nav>

        <div className="sidebar-footer">
          <div className="user-pill" onClick={handleLogout} title="Click to sign out">
            <div className="user-avatar">V</div>
            <div className="user-info">
              <div className="user-name">My Vault</div>
              <div className="user-email">{loggingOut ? 'Signing out…' : 'Click to sign out'}</div>
            </div>
          </div>
        </div>
      </aside>
      <main className="main-content">{children}</main>
    </div>
  )
}
