import { BookOpen, Key, Cpu, Shield, ArrowRight, Terminal, LockKeyhole, Zap } from 'lucide-react'

export default function DocsPage() {
  return (
    <>
      <div className="page-header" style={{ marginBottom: 40 }}>
        <div>
          <h1 className="page-title" style={{ fontSize: 32, marginBottom: 8 }}>Developer Hub</h1>
          <p className="page-subtitle" style={{ fontSize: 16, maxWidth: 600 }}>Master your credential infrastructure. Learn how to secure, rotate, and dynamically inject secrets into your AI workflows via MCP.</p>
        </div>
      </div>

      <div className="page-body" style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        
        {/* Quick Start Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          <div className="card fade-up" style={{ padding: 24, background: 'linear-gradient(145deg, var(--bg-elevated) 0%, rgba(20,20,20,1) 100%)', border: '1px solid rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, background: 'var(--accent)', filter: 'blur(80px)', opacity: 0.15 }} />
            <Key size={28} color="var(--accent)" style={{ marginBottom: 16 }} />
            <h3 style={{ fontSize: 17, fontWeight: 600, marginBottom: 8 }}>Secrets Management</h3>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 16 }}>Store API keys using AES-256-GCM encryption. Keys are decrypted exclusively in memory upon authorized request.</p>
          </div>

          <div className="card fade-up" style={{ padding: 24, animationDelay: '0.1s', background: 'linear-gradient(145deg, var(--bg-elevated) 0%, rgba(20,20,20,1) 100%)', border: '1px solid rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, background: 'var(--cyan)', filter: 'blur(80px)', opacity: 0.15 }} />
            <Cpu size={28} color="var(--cyan)" style={{ marginBottom: 16 }} />
            <h3 style={{ fontSize: 17, fontWeight: 600, marginBottom: 8 }}>MCP Integration</h3>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 16 }}>Connect Claude Desktop and Cursor to Vaultix. Let your custom AI agents inject secrets autonomously.</p>
          </div>

          <div className="card fade-up" style={{ padding: 24, animationDelay: '0.2s', background: 'linear-gradient(145deg, var(--bg-elevated) 0%, rgba(20,20,20,1) 100%)', border: '1px solid rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, background: 'var(--green)', filter: 'blur(80px)', opacity: 0.15 }} />
            <Shield size={28} color="var(--green)" style={{ marginBottom: 16 }} />
            <h3 style={{ fontSize: 17, fontWeight: 600, marginBottom: 8 }}>Audit & Compliance</h3>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 16 }}>Track every access event, modification, and IP request in the immutable backend ledger for full visibility.</p>
          </div>
        </div>

        {/* Deep Dive Section */}
        <div className="card fade-up" style={{ animationDelay: '0.3s', padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)' }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 10 }}>
              <BookOpen size={18} color="var(--accent)" /> Detailed Implementation Guide
            </h2>
          </div>
          
          <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: 32 }}>
            
            {/* 1. Managing Secrets */}
            <div style={{ paddingBottom: 24, borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <Key size={18} color="var(--accent)" />
                <h3 style={{ fontSize: 17, fontWeight: 600 }}>1. Managing Your Secrets</h3>
              </div>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 16 }}>
                The Vault is your primary workspace for securing credentials. Every secret added is encrypted both client-side and server-side using AES-256-GCM. 
              </p>
              <ul style={{ color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: 10, listStyleType: 'disc', paddingLeft: 20 }}>
                <li><strong style={{ color: 'var(--text-primary)' }}>Identifiers:</strong> Use descriptive identifiers (e.g., OPENAI_API_KEY) for easy retrieval by AI agents. This exact identifier must be used by the agent to fetch it.</li>
                <li><strong style={{ color: 'var(--text-primary)' }}>Taxonomy:</strong> Select the matching category. Vaultix automatically maps popular services to their native icons based on substrings (e.g. typing "stripe" maps to the Finance category icon automatically).</li>
                <li><strong style={{ color: 'var(--text-primary)' }}>Visibility:</strong> Passwords are never visible by default to prevent shoulder surfing. You must explicitly reveal them in the details pane.</li>
              </ul>
            </div>

            {/* 2. MCP */}
            <div style={{ paddingBottom: 24, borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <Cpu size={18} color="var(--cyan)" />
                <h3 style={{ fontSize: 17, fontWeight: 600 }}>2. AI Agent Integration (MCP)</h3>
              </div>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 16 }}>
                Vaultix acts as an MCP (Model Context Protocol) Server. AI IDEs (like Cursor) and Assistants (like Claude Desktop) can securely request environment variables directly from your Vault without storing them locally on your machine.
              </p>
              <div style={{ background: '#0a0a0a', padding: '20px 24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', marginBottom: 16 }}>
                <strong style={{ fontSize: 14, display: 'block', marginBottom: 12, color: 'var(--text-primary)' }}>Getting Started with MCP:</strong>
                <ol style={{ color: 'var(--text-secondary)', fontSize: 14, margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <li>Navigate to the <span style={{ color: 'var(--accent)' }}>MCP Integration</span> page.</li>
                  <li>Click "Generate New Profile" to create an Access Token for your specific client (e.g., "Cursor Work").</li>
                  <li>In your Claude Desktop or Cursor configuration file (`claude_desktop_config.json`), paste the provided JSON snippet.</li>
                </ol>
              </div>
              
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
                We use an <strong>npx wrapper</strong> to directly interface with our API.
              </p>
              <div style={{ background: '#0d0d0d', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 16, marginTop: 12 }}>
                <code className="mono" style={{ color: 'var(--text-primary)', fontSize: 13, display: 'block' }}>
                  <span style={{ color: 'var(--cyan)' }}>npx</span> -y https://your-domain.vercel.app/vaultix-mcp.tgz?v=2
                </code>
              </div>
            </div>

            {/* 3. Security */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <Shield size={18} color="var(--green)" />
                <h3 style={{ fontSize: 17, fontWeight: 600 }}>3. Security & Audit Logs</h3>
              </div>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 16 }}>
                Your data sovereignty is our top priority. The entire pipeline operates defensively:
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 1fr) minmax(200px, 1fr)', gap: 20 }}>
                 <div style={{ background: 'rgba(255,255,255,0.02)', padding: 16, borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.05)' }}>
                   <strong style={{ display: 'block', fontSize: 14, marginBottom: 8, color: 'var(--text-primary)' }}>Immutable Logging</strong>
                   <span style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>Every individual access, creation, or modification action generates an immutable Audit Log. You can see IP addresses and timestamps attached to every MCP request.</span>
                 </div>
                 <div style={{ background: 'rgba(255,255,255,0.02)', padding: 16, borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.05)' }}>
                   <strong style={{ display: 'block', fontSize: 14, marginBottom: 8, color: 'var(--text-primary)' }}>Token Isolation</strong>
                   <span style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>Unauthorized token access is instantly rejected and recorded. Your API access tokens should be rotated regularly for optimal zero-trust security.</span>
                 </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </>
  )
}
