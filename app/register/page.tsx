'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { TerminalSquare } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Registration failed')
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
        <h1 className="auth-title mono">{'>'} ESTABLISH_NEW_NODE</h1>
        <p className="auth-subtitle mono">{'>'} Generate initial encryption keys</p>
        {error && <div className="auth-error">{error}</div>}
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label" htmlFor="name">Full name</label>
            <input id="name" type="text" className="input" placeholder="Jane Smith" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="input-group">
            <label className="input-label" htmlFor="email">Email</label>
            <input id="email" type="email" className="input" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="input-group">
            <label className="input-label" htmlFor="password">Password</label>
            <input id="password" type="password" className="input" placeholder="At least 8 characters" value={password} onChange={e => setPassword(e.target.value)} required minLength={8} />
          </div>
          <button type="submit" className="btn btn-primary btn-lg mono" disabled={loading} style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}>
            {loading ? <><span className="spinner" />GENERATING_KEYS...</> : '[ INITIALIZE_VAULT ]'}
          </button>
        </form>
        <p className="auth-switch mono">{'>'} NODE_ALREADY_EXISTS? <Link href="/login">SECURE_LOGIN</Link></p>
      </div>
    </div>
  )
}
