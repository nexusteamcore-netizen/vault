'use client'
import { useEffect, useState } from 'react'
import { Bot, Copy, Eye, EyeOff, Key } from 'lucide-react'

interface McpToken { id: string; name: string; token: string; lastUsed?: string; createdAt: string }


export default function McpPage() {
  const [appUrl, setAppUrl] = useState('')

  const [tokens, setTokens] = useState<McpToken[]>([])
  const [loading, setLoading] = useState(true)
  const [newName, setNewName] = useState('')
  const [creating, setCreating] = useState(false)
  const [toast, setToast] = useState<{ msg: string; type: string } | null>(null)
  const [revealedTokens, setRevealedTokens] = useState<Set<string>>(new Set())

  function showToast(msg: string, type = 'info') {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }

  async function loadTokens() {
    const res = await fetch('/api/mcp/token')
    const data = await res.json()
    setTokens(data.tokens || [])
    setLoading(false)
  }

  useEffect(() => { 
    loadTokens()
    if (typeof window !== 'undefined') setAppUrl(window.location.origin)
  }, [])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setCreating(true)
    try {
      const res = await fetch('/api/mcp/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      showToast('Token created! Copy it now — it won\'t be shown again.', 'success')
      setNewName('')
      setRevealedTokens(prev => new Set([...prev, data.token.id]))
      await loadTokens()
    } catch (err: any) {
      showToast(err.message, 'error')
    } finally {
      setCreating(false)
    }
  }

  async function handleRevoke(id: string) {
    const res = await fetch('/api/mcp/token', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    if (res.ok) {
      showToast('Token revoked', 'success')
      await loadTokens()
    }
  }

  function copy(text: string) {
    navigator.clipboard.writeText(text)
    showToast('Copied!', 'success')
  }

  const claudeConfig = (token: string) => JSON.stringify({
    mcpServers: {
      vaultix: {
        command: 'npx',
        args: ['-y', `${appUrl || 'https://your-domain.com'}/vaultix-mcp.tgz?v=2`],
        env: { VAULTIX_TOKEN: token, VAULTIX_URL: `${appUrl || 'https://your-domain.com'}/api/mcp` },
      },
    },
  }, null, 2)

  return (
    <>
      {toast && (
        <div className="toast-container">
          <div className={`toast toast-${toast.type}`}>
            {toast.type === 'success' ? '✓' : '✕'} {toast.msg}
          </div>
        </div>
      )}

      <div className="page-header">
        <div>
          <h1 className="page-title">MCP Integration</h1>
          <p className="page-subtitle">Let AI agents fetch your credentials automatically</p>
        </div>

      </div>

      <div className="page-body" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* What is MCP */}
        <div className="card fade-up" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(34,211,238,0.05) 100%)', borderColor: 'rgba(99,102,241,0.3)' }}>
          <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
            <div style={{ flexShrink: 0, color: 'var(--accent)' }}><Bot size={36} /></div>
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>What is MCP?</h2>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                The <strong style={{ color: 'var(--cyan)' }}>Model Context Protocol</strong> lets AI agents like Claude and Cursor securely call tools on your behalf.
                With Vaultix + MCP, your agent can call <code style={{ background: 'var(--bg-input)', padding: '2px 6px', borderRadius: 4, fontSize: 12 }}>get_secret("OPENAI_API_KEY")</code> and receive your decrypted key — no hardcoding required.
              </p>
            </div>
          </div>
        </div>

        {/* API Endpoint */}
        <div className="card fade-up" style={{ animationDelay: '0.05s' }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>MCP Endpoint</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="key-masked mono" style={{ flex: 1 }}>{appUrl || 'https://your-domain.com'}/api/mcp</div>
            <button className="btn btn-secondary btn-sm mono" onClick={() => copy(`${appUrl || 'https://your-domain.com'}/api/mcp`)}><Copy size={14} style={{ marginRight: 6 }} /> COPY_URL</button>
          </div>
          <div style={{ marginTop: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 12, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Available Tools</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { name: 'list_secrets', desc: 'List all secret names (values not returned)', badge: 'GET' },
                { name: 'get_secret', desc: 'Retrieve a decrypted secret by name', badge: 'POST' },
                { name: 'set_secret', desc: 'Create or update a secret value', badge: 'POST' },
              ].map(t => (
                <div key={t.name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                  <span className="badge badge-cyan">{t.badge}</span>
                  <code className="mono" style={{ color: 'var(--accent)', fontSize: 13 }}>{t.name}</code>
                  <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{t.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Create Token */}
        <div className="card fade-up" style={{ animationDelay: '0.1s' }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Create Access Token</h2>
          <form onSubmit={handleCreate} style={{ display: 'flex', gap: 10 }}>
            <input
              className="input"
              placeholder="Token name (e.g. Claude Desktop, Cursor)"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              required
              style={{ flex: 1 }}
            />
            <button type="submit" className="btn btn-primary" disabled={creating}>
              {creating ? <><span className="spinner" /> Creating…</> : 'GENERATE_TOKEN'}
            </button>
          </form>
        </div>

        {/* Tokens List */}
        <div className="card fade-up" style={{ animationDelay: '0.15s' }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Active Tokens</h2>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}><div className="spinner" style={{ width: 28, height: 28 }} /></div>
          ) : tokens.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12, opacity: 0.5 }}><Key size={32} /></div>
              <p className="mono">{'>'} NO_TOKENS_DETECTED. GENERATE_ACCESS_KEY.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {tokens.map(tok => (
                <div key={tok.id} style={{ padding: 20, background: 'var(--bg-elevated)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{tok.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                        Created {new Date(tok.createdAt).toLocaleDateString()}
                        {tok.lastUsed && ` · Last used ${new Date(tok.lastUsed).toLocaleDateString()}`}
                      </div>
                    </div>
                    <button className="btn btn-danger btn-sm" onClick={() => handleRevoke(tok.id)}>Revoke</button>
                  </div>

                  {/* Token value */}
                  <div className="key-value-row" style={{ marginBottom: 16 }}>
                    <div className="key-masked mono" style={{ fontSize: 12 }}>
                      {revealedTokens.has(tok.id) ? tok.token : `${tok.token.slice(0, 8)}${'•'.repeat(32)}`}
                    </div>
                    <button className="btn btn-ghost btn-sm" onClick={() => setRevealedTokens(prev => { const n = new Set(prev); prev.has(tok.id) ? n.delete(tok.id) : n.add(tok.id); return n })}>
                      {revealedTokens.has(tok.id) ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                    <button className="btn btn-secondary btn-sm mono" onClick={() => copy(tok.token)}><Copy size={14} style={{ marginRight: 6 }} /> COPY</button>
                  </div>

                  {/* Claude config */}
                  {revealedTokens.has(tok.id) && (
                    <div style={{ marginTop: 8 }}>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>Claude Desktop / Cursor config:</div>
                      <div style={{ position: 'relative' }}>
                        <pre className="mono" style={{ fontSize: 11, lineHeight: 1.7, background: 'var(--bg-base)', padding: 16, borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', color: 'var(--cyan)', overflow: 'auto' }}>
                          {claudeConfig(tok.token)}
                        </pre>
                        <button className="btn btn-ghost btn-sm" style={{ position: 'absolute', top: 8, right: 8 }} onClick={() => copy(claudeConfig(tok.token))}><Copy size={14} /></button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
