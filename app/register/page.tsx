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
      
      const text = await res.text()
      let data
      try {
        data = JSON.parse(text)
      } catch (parseErr) {
        console.error('Server returned non-JSON:', text)
        const titleMatch = text.match(/<title>(.*?)<\/title>/)
        const errorMessage = titleMatch ? `Server Error: ${titleMatch[1]}` : `Server returned HTML. (Check console for details)`
        throw new Error(errorMessage)
      }

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
        <div className="auth-logo" style={{ marginBottom: 28, justifyContent: 'center', fontSize: '1.5rem', fontWeight: 500, letterSpacing: '2px' }}>
          PHANTOM.
        </div>
        <h1 className="auth-title" style={{ fontSize: 28, fontWeight: 700, textAlign: 'center', marginBottom: 8, letterSpacing: '-0.02em' }}>Create Account</h1>
        <p className="auth-subtitle" style={{ textAlign: 'center', marginBottom: 24, fontSize: 15, opacity: 0.7 }}>Secure your assets with PhantomAPI</p>

        {error && <div className="auth-error" style={{ marginBottom: 16 }}>{error}</div>}

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
            {loading ? <><span className="spinner" /> Generating Keys...</> : 'Initialize PhantomAPI'}
          </button>
        </form>
        <p className="auth-switch" style={{ textAlign: 'center', marginTop: 32, fontSize: 14, opacity: 0.8 }}>Existing operator? <Link href="/login" style={{ color: 'var(--accent)', fontWeight: 600 }}>Authenticate here</Link></p>
      </div>
    </div>
  )
}
