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
      <div className="auth-box">
        <div className="auth-logo boot-text" style={{ marginBottom: 40, justifyContent: 'center' }}>
          <TerminalSquare size={28} className="text-green" />
          <span style={{ marginLeft: 12, letterSpacing: '0.25em', fontWeight: 800 }}>VAULTIX</span>
        </div>
        <h1 className="auth-title" style={{ fontSize: 28, fontWeight: 700, textAlign: 'center', marginBottom: 8, letterSpacing: '-0.02em' }}>Create Account</h1>
        <p className="auth-subtitle" style={{ textAlign: 'center', marginBottom: 40, fontSize: 15, opacity: 0.7 }}>Secure your assets with Vaultix</p>

        {error && <div className="auth-error" style={{ marginBottom: 24 }}>{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label" htmlFor="name" style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, opacity: 0.8 }}>Full Designation</label>
            <input id="name" type="text" className="input" placeholder="Enter your name" style={{ height: 50, fontSize: 15 }} value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="input-group">
            <label className="input-label" htmlFor="email" style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, opacity: 0.8 }}>Security Email</label>
            <input id="email" type="email" className="input" placeholder="operator@company.com" style={{ height: 50, fontSize: 15 }} value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="input-group">
            <label className="input-label" htmlFor="password" style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, opacity: 0.8 }}>New Password</label>
            <input id="password" type="password" className="input" placeholder="Min 8 characters" style={{ height: 50, fontSize: 15 }} value={password} onChange={e => setPassword(e.target.value)} required minLength={8} />
          </div>
          <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: '100%', justifyContent: 'center', marginTop: 12, height: 52, fontSize: 16, fontWeight: 600 }}>
            {loading ? <><span className="spinner" /> Generating Keys...</> : 'Initialize Vault'}
          </button>
        </form>
        <p className="auth-switch" style={{ textAlign: 'center', marginTop: 40, fontSize: 14, opacity: 0.8 }}>Already registered? <Link href="/login" style={{ color: 'var(--green)', fontWeight: 600 }}>Secure Login</Link></p>
      </div>
    </div>
  )
}
