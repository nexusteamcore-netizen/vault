'use client'
import { useState } from 'react'
import { Copy, Terminal, Zap, Code2, Link as LinkIcon } from 'lucide-react'
import Link from 'next/link'

export default function SdkPage() {
  const [toast, setToast] = useState<{ msg: string; type: string } | null>(null)

  function showToast(msg: string, type = 'info') {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }

  function copy(text: string) {
    navigator.clipboard.writeText(text)
    showToast('Copied to clipboard!', 'success')
  }

  return (
    <>
      {toast && (
        <div className="toast-container">
          <div className={`toast toast-${toast.type}`}>
            {toast.type === 'success' ? '✓' : '✕'} {toast.msg}
          </div>
        </div>
      )}

      <div className="page-header" style={{ marginBottom: 40 }}>
        <div>
          <h1 className="page-title">Developer SDK</h1>
          <p className="page-subtitle">Integrate PhantomAPI directly into your codebase.</p>
        </div>
        <Link href="/mcp" className="btn btn-primary">
          GET_API_KEY
        </Link>
      </div>

      <div className="page-body" style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

        {/* Integration Methods Container */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <Zap size={16} className="pulse-cyan" style={{ color: 'var(--accent)' }} />
            <h2 style={{
              fontSize: 'var(--text-lg)',
              fontWeight: 'var(--fw-regular)',
              letterSpacing: 'var(--tracking-snug)',
              color: 'var(--text-primary)'
            }}>Plug &amp; Play Integration</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 20 }}>

            {/* CLI Card */}
            <div className="card" style={{ background: 'rgba(5, 5, 5, 0.8)', borderColor: 'var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Terminal size={15} style={{ color: 'var(--text-muted)' }} />
                  <span style={{
                    fontSize: 'var(--text-base)',
                    fontWeight: 'var(--fw-normal)',
                    letterSpacing: 'var(--tracking-snug)',
                    color: 'var(--text-secondary)'
                  }}>Global CLI</span>
                </div>
                <span className="badge badge-muted">v1.0.0</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  { step: 'Step 1: Install', cmd: 'npm i -g @phantomapi/cli' },
                  { step: 'Step 2: Login', cmd: 'phantomapi login <TOKEN>' },
                  { step: 'Step 3: Retrieve', cmd: 'phantomapi get firebase' },
                ].map(({ step, cmd }) => (
                  <div key={step}>
                    <div style={{
                      fontSize: 'var(--text-2xs)',
                      fontWeight: 'var(--fw-medium)',
                      color: 'var(--text-muted)',
                      letterSpacing: 'var(--tracking-caps)',
                      textTransform: 'uppercase',
                      marginBottom: 6
                    }}>{step}</div>
                    <div className="mono" style={{
                      fontSize: 13,
                      background: 'var(--bg-base)',
                      border: '1px solid var(--border)',
                      padding: '10px 14px',
                      borderRadius: 6,
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                    }}>
                      <span><span style={{ color: 'var(--accent)' }}>$</span> {cmd}</span>
                      <button className="btn btn-ghost btn-sm" style={{ padding: 4, height: 'auto' }} onClick={() => copy(cmd)}>
                        <Copy size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SDK Card */}
            <div className="card" style={{ background: 'rgba(5, 5, 5, 0.8)', borderColor: 'var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Code2 size={15} style={{ color: 'var(--text-muted)' }} />
                  <span style={{
                    fontSize: 'var(--text-base)',
                    fontWeight: 'var(--fw-normal)',
                    letterSpacing: 'var(--tracking-snug)',
                    color: 'var(--text-secondary)'
                  }}>Node.js SDK</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div className="mono" style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                  <span style={{ color: 'var(--accent)' }}>$</span> npm i @phantomapi/sdk
                </div>

                <div style={{ position: 'relative' }}>
                  <pre style={{
                    background: 'var(--bg-base)',
                    border: '1px solid var(--border)',
                    borderRadius: 6,
                    padding: '16px',
                    overflow: 'auto',
                    fontSize: 12,
                    lineHeight: 1.7
                  }} className="mono">
  <span style={{ color: '#8b949e' }}>// 1. Put this in your .env</span>{'\n'}
  <span style={{ color: '#a5d6ff' }}>PHANTOMAPI_API_KEY</span>=your_access_token{'\n\n'}
  <span style={{ color: '#8b949e' }}>// 2. Use it anywhere in your code</span>{'\n'}
  <span style={{ color: '#ff7b72' }}>import</span> {'{ PhantomAPI }'} <span style={{ color: '#ff7b72' }}>from</span> <span style={{ color: '#a5d6ff' }}>'@phantomapi/sdk'</span>;{'\n\n'}
  <span style={{ color: '#ff7b72' }}>const</span> api = <span style={{ color: '#ff7b72' }}>new</span> PhantomAPI();{'\n'}
  <span style={{ color: '#ff7b72' }}>const</span> key = <span style={{ color: '#ff7b72' }}>await</span> api.get(<span style={{ color: '#a5d6ff' }}>"openai_service"</span>);
                  </pre>
                  <button
                    className="btn btn-ghost btn-sm"
                    style={{ position: 'absolute', top: 8, right: 8, padding: 4, height: 'auto', background: 'var(--bg-base)' }}
                    onClick={() => copy(`import { PhantomAPI } from '@phantomapi/sdk';\n\nconst api = new PhantomAPI();\nconst key = await api.get("openai_service");`)}
                  >
                    <Copy size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* REST API section */}
        <div className="card fade-up" style={{ animationDelay: '0.1s' }}>
          <h2 style={{
            fontSize: 'var(--text-lg)',
            fontWeight: 'var(--fw-regular)',
            letterSpacing: 'var(--tracking-snug)',
            marginBottom: 12,
            display: 'flex', alignItems: 'center', gap: 8,
            color: 'var(--text-primary)'
          }}>
            <LinkIcon size={15} style={{ color: 'var(--text-muted)' }} /> Using the REST API
          </h2>
          <p className="body-text" style={{ marginBottom: 20 }}>
            Under the hood, all official SDKs use the PhantomAPI REST API. You can generate an API Key on the{' '}
            <Link href="/mcp" style={{ color: 'var(--accent)', textDecoration: 'underline', textUnderlineOffset: 3 }}>MCP &amp; Tokens</Link> page,
            and make direct HTTP requests via <code className="mono" style={{ fontSize: 12, color: 'var(--accent)' }}>/api/v1/secrets</code>.
          </p>

          <div style={{ position: 'relative' }}>
            <pre style={{
              background: 'var(--bg-input)',
              padding: 16,
              borderRadius: 6,
              border: '1px solid var(--border)',
              color: 'var(--text-primary)',
              fontSize: 12,
              overflowX: 'auto',
              lineHeight: 1.7
            }} className="mono">
  <span style={{ color: '#ff7b72' }}>const</span> response = <span style={{ color: '#ff7b72' }}>await</span> fetch(<span style={{ color: '#a5d6ff' }}>'https://yourapp.net/api/v1/secrets/STRIPE_KEY'</span>, {'{\n'}
    headers: {'{\n'}
      <span style={{ color: '#79c0ff' }}>'Authorization'</span>: <span style={{ color: '#a5d6ff' }}>'Bearer your_api_key_here'</span>{'\n'}
    {'}\n'}
  {'}'});{'\n'}
  <span style={{ color: '#ff7b72' }}>const</span> {'{ name, value }'} = <span style={{ color: '#ff7b72' }}>await</span> response.json();
            </pre>
          </div>
        </div>
      </div>
    </>
  )
}
