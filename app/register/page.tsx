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
        <div className="auth-logo boot-text">
          <TerminalSquare size={28} className="text-green" />
          <span className="brand-text">VAULTIX</span>
        </div>
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-subtitle">Secure your assets with Vaultix</p>
        
        {error && <div className="auth-error">{error}</div>}
        
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label" htmlFor="name">Full Designation</label>
            <input id="name" type="text" className="input" placeholder="Enter your designation" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="input-group">
            <label className="input-label" htmlFor="email">Security Email</label>
            <input id="email" type="email" className="input" placeholder="operator@company.com" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="input-group">
            <label className="input-label" htmlFor="password">New Password</label>
            <input id="password" type="password" className="input" placeholder="Min 8 characters" value={password} onChange={e => setPassword(e.target.value)} required minLength={8} />
          </div>
          <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: '100%', justifyContent: 'center', marginTop: 12 }}>
            {loading ? <><span className="spinner" /> Generating Keys...</> : 'Initialize Vault'}
          </button>
        </form>
        <p className="auth-switch">Already registered? <Link href="/login">Secure Login</Link></p>
      </div>
    </div>
  )
}
