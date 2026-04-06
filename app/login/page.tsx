'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { TerminalSquare } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Login failed')
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-orb" />
      <div className="auth-box">
        <div className="auth-logo boot-text">
          <TerminalSquare size={20} className="blink" />
          <span style={{ marginLeft: 8, letterSpacing: '0.1em' }}>VAULTIX_</span>
        </div>
        <h1 className="auth-title mono">{'>'} SECURE_LOGIN_PORTAL</h1>
        <p className="auth-subtitle mono">{'>'} Initiate connection to encrypted core</p>
        {error && <div className="auth-error">{error}</div>}
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label" htmlFor="email">Email</label>
            <input id="email" type="email" className="input" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="input-group">
            <label className="input-label" htmlFor="password">Password</label>
            <input id="password" type="password" className="input" placeholder="••••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary btn-lg mono" disabled={loading} style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}>
            {loading ? <><span className="spinner" />DECRYPTING_HANDSHAKE...</> : '[ INITIATE_CONNECTION ]'}
          </button>
        </form>
        <p className="auth-switch mono">{'>'} NO_ACCOUNT_DETECTED? <Link href="/register">ESTABLISH_NEW_NODE</Link></p>
      </div>
    </div>
  )
}
