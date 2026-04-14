'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Shield } from 'lucide-react'

export default function SettingsPage() {
  const router = useRouter()
  const [user, setUser] = useState<{ email: string; name: string | null } | null>(null)
  const [name, setName] = useState('')
  const [toast, setToast] = useState<{ msg: string; type: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [oldPw, setOldPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [pwLoading, setPwLoading] = useState(false)

  function showToast(msg: string, type = 'info') {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(d => {
      if (d.user) { setUser(d.user); setName(d.user.name || '') }
    })
  }, [])

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  return (
    <>
      {toast && (
        <div className="toast-container">
          <div className={`toast toast-${toast.type}`}>{toast.type === 'success' ? '✓' : 'ℹ'} {toast.msg}</div>
        </div>
      )}
      <div className="page-header">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Manage your account and preferences</p>
        </div>
      </div>

      <div className="page-body">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 24,
          alignItems: 'start'
        }}>
          {/* Main Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

            {/* Profile */}
            <div className="card fade-up">
              <h2 style={{
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--fw-medium)',
                letterSpacing: 'var(--tracking-caps)',
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
                marginBottom: 20
              }}>Profile</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                <div style={{
                  width: 52, height: 52,
                  background: 'var(--accent-dim)',
                  border: '1px solid var(--border-hover)',
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 18, fontWeight: 400, color: 'var(--accent)'
                }}>
                  {(user?.name || user?.email || 'V')[0].toUpperCase()}
                </div>
                <div>
                  <div style={{
                    fontSize: 'var(--text-md)',
                    fontWeight: 'var(--fw-regular)',
                    letterSpacing: 'var(--tracking-snug)',
                    color: 'var(--text-primary)'
                  }}>{user?.name || 'Vault User'}</div>
                  <div className="body-small">{user?.email}</div>
                </div>
              </div>
              <div className="input-group" style={{ marginBottom: 12 }}>
                <label className="input-label" htmlFor="s-name">Display Name</label>
                <input id="s-name" className="input" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" />
              </div>
              <div className="input-group" style={{ marginBottom: 20 }}>
                <label className="input-label">Email</label>
                <input className="input" value={user?.email || ''} disabled style={{ opacity: 0.4 }} />
              </div>
              <button className="btn btn-primary btn-sm" disabled={loading} onClick={() => showToast('Profile update coming soon', 'info')}>
                Save Changes
              </button>
            </div>

            {/* Security */}
            <div className="card fade-up" style={{ animationDelay: '0.05s' }}>
              <h2 style={{
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--fw-medium)',
                letterSpacing: 'var(--tracking-caps)',
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
                marginBottom: 20
              }}>Security</h2>
              <div className="input-group" style={{ marginBottom: 12 }}>
                <label className="input-label" htmlFor="s-oldpw">Current Password</label>
                <input id="s-oldpw" type="password" className="input" value={oldPw} onChange={e => setOldPw(e.target.value)} placeholder="••••••••" />
              </div>
              <div className="input-group" style={{ marginBottom: 20 }}>
                <label className="input-label" htmlFor="s-newpw">New Password</label>
                <input id="s-newpw" type="password" className="input" value={newPw} onChange={e => setNewPw(e.target.value)} placeholder="At least 8 characters" />
              </div>
              <button className="btn btn-secondary btn-sm" disabled={pwLoading} onClick={() => showToast('Password change coming soon', 'info')}>
                Update Password
              </button>
            </div>
          </div>

          {/* Secondary Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

            {/* Encryption info */}
            <div className="card fade-up" style={{ animationDelay: '0.1s', borderColor: 'rgba(0, 229, 255, 0.12)', background: 'rgba(0, 229, 255, 0.03)' }}>
              <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 2 }}><Shield size={20} /></div>
                <div>
                  <h2 style={{
                    fontSize: 'var(--text-base)',
                    fontWeight: 'var(--fw-regular)',
                    letterSpacing: 'var(--tracking-snug)',
                    marginBottom: 6,
                    color: 'var(--accent)'
                  }}>Encryption Protocol</h2>
                  <p className="body-small" style={{ lineHeight: 'var(--leading-loose)' }}>
                    Secrets are encrypted using <strong style={{ color: 'var(--text-primary)', fontWeight: 400 }}>AES-256-GCM</strong>. Your master key is never stored in plain text.
                  </p>
                  <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    <span className="badge badge-cyan">AES-256</span>
                    <span className="badge badge-cyan">GCM</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Session */}
            <div className="card fade-up" style={{ animationDelay: '0.15s' }}>
              <h2 style={{
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--fw-medium)',
                letterSpacing: 'var(--tracking-caps)',
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
                marginBottom: 8
              }}>Session Control</h2>
              <p className="body-small" style={{ marginBottom: 16 }}>Authorized device session active.</p>
              <button className="btn btn-ghost btn-sm" style={{ width: '100%' }} onClick={handleLogout}>Sign out</button>
            </div>

            {/* Danger zone */}
            <div className="card fade-up" style={{ animationDelay: '0.2s', borderColor: 'rgba(239,68,68,0.12)', background: 'rgba(239,68,68,0.02)' }}>
              <h2 style={{
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--fw-medium)',
                letterSpacing: 'var(--tracking-caps)',
                textTransform: 'uppercase',
                color: 'var(--red)',
                marginBottom: 8
              }}>Account Deletion</h2>
              <p className="body-small" style={{ marginBottom: 16 }}>Permanently delete your account and all stored secrets.</p>
              <button className="btn btn-danger btn-sm" style={{ width: '100%', background: 'transparent', borderColor: 'rgba(239,68,68,0.25)' }} onClick={() => showToast('Account deletion protection active', 'info')}>
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
