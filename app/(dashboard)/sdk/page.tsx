'use client'
import { useState } from 'react'
import { Copy, Terminal, Zap, Code2, Link as LinkIcon, ExternalLink } from 'lucide-react'
import Link from 'next/link'

export default function SdkPage() {
  const [toast, setToast] = useState<{ msg: string; type: string } | null>(null)
  const [isReady, setIsReady] = useState(false) // Toggle this to true to restore the UI

  function showToast(msg: string, type = 'info') {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }

  function copy(text: string) {
    navigator.clipboard.writeText(text)
    showToast('Copied to clipboard!', 'success')
  }

  if (!isReady) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '60vh',
        fontFamily: 'sans-serif'
      }}>
        <h1 style={{ 
          fontSize: 16, 
          fontWeight: 400, 
          color: 'var(--text-muted)',
          letterSpacing: '0.1em'
        }}>Coming Soon</h1>
      </div>
    )
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
          <p className="page-subtitle">Integrate Vaultix directly into your codebase.</p>
        </div>
        <Link href="/mcp" className="btn btn-primary">
          <Zap size={14} /> GET_API_KEY
        </Link>
      </div>

      <div className="page-body" style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

        {/* Integration Methods Container */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <Zap size={20} className="pulse-green" style={{ color: 'var(--accent)' }}/>
            <h2 style={{ fontSize: 18, fontWeight: 600 }}>Plug & Play Integration</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 20 }}>
            
            {/* CLI Card */}
            <div className="card" style={{ background: 'rgba(5, 5, 5, 0.8)', borderColor: 'var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)' }}>
                  <Terminal size={16} /> <span style={{ fontSize: 14, fontWeight: 600 }}>Global CLI</span>
                </div>
                <span className="badge badge-muted">v1.0.0</span>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 600 }} className="mono">
                  <span style={{ color: 'var(--accent)' }}>$</span> npm i -g @vaultix/cli
                </div>
                
                <div style={{ 
                  background: 'var(--bg-base)', 
                  border: '1px solid var(--border)', 
                  borderRadius: 'var(--radius-md)', 
                  padding: '12px 14px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{ fontSize: 13 }} className="mono">
                    <span style={{ color: 'var(--accent)' }}>$</span> vaultix get STRIPE_KEY
                  </div>
                  <button className="btn btn-ghost btn-sm" style={{ padding: 4, height: 'auto' }} onClick={() => copy('vaultix get STRIPE_KEY')}>
                    <Copy size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* SDK Card */}
            <div className="card" style={{ background: 'rgba(5, 5, 5, 0.8)', borderColor: 'var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)' }}>
                  <Code2 size={16} /> <span style={{ fontSize: 14, fontWeight: 600 }}>Node.js SDK</span>
                </div>
              </div>
              
              <div style={{ position: 'relative' }}>
                <pre style={{ 
                  background: 'var(--bg-base)', 
                  border: '1px solid var(--border)', 
                  borderRadius: 'var(--radius-md)', 
                  padding: '16px',
                  overflow: 'auto',
                  fontSize: 13,
                  lineHeight: 1.6
                }} className="mono">
  <span style={{ color: '#ff7b72' }}>import</span> {'{ Vaultix }'} <span style={{ color: '#ff7b72' }}>from</span> <span style={{ color: '#a5d6ff' }}>'@vaultix/sdk'</span>;{'\n\n'}
  <span style={{ color: '#ff7b72' }}>const</span> vault = <span style={{ color: '#ff7b72' }}>new</span> Vaultix();{'\n'}
  <span style={{ color: '#ff7b72' }}>const</span> key = <span style={{ color: '#ff7b72' }}>await</span> vault.get(<span style={{ color: '#a5d6ff' }}>"STRIPE_KEY"</span>);
                </pre>
                <button 
                  className="btn btn-ghost btn-sm" 
                  style={{ position: 'absolute', top: 8, right: 8, padding: 4, height: 'auto', background: 'var(--bg-base)' }} 
                  onClick={() => copy(`import { Vaultix } from '@vaultix/sdk';\n\nconst vault = new Vaultix();\nconst key = await vault.get("STRIPE_KEY");`)}
                >
                  <Copy size={14} />
                </button>
              </div>
            </div>
            
          </div>
        </div>

        {/* REST API & Instructions section */}
        <div className="card fade-up" style={{ animationDelay: '0.1s' }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <LinkIcon size={16} /> Using the REST API
          </h2>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 20 }}>
            Under the hood, all official SDKs use the Vaultix REST API. You can generate an API Key on the <Link href="/mcp" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>MCP & Tokens</Link> page, and make direct HTTP requests via <code className="mono">/api/v1/secrets</code>.
          </p>
          
          <div style={{ position: 'relative', marginTop: 16 }}>
            <pre style={{ 
              background: 'var(--bg-input)', 
              padding: 16, 
              borderRadius: 'var(--radius-md)', 
              border: '1px solid var(--border)', 
              color: 'var(--text-primary)', 
              fontSize: 13,
              overflowX: 'auto'
            }} className="mono">
  <span style={{ color: '#ff7b72' }}>const</span> response = <span style={{ color: '#ff7b72' }}>await</span> fetch(<span style={{ color: '#a5d6ff' }}>'https://yourapp.net/api/v1/secrets/STRIPE_KEY'</span>, {'{\n'}
    headers: {'{\n'}
      <span style={{ color: '#79c0ff' }}>'Authorization'</span>: <span style={{ color: '#a5d6ff' }}>'Bearer vtx_your_api_key_here'</span>{'\n'}
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
