'use client'

import { Mail, MessageCircle, ExternalLink, LifeBuoy, ArrowRight, AlertTriangle, HelpCircle, LockKeyhole, Shield } from 'lucide-react'

export default function SupportPage() {
  return (
    <>
      <div className="page-header" style={{ marginBottom: 40 }}>
        <div>
          <h1 className="page-title" style={{ fontSize: 32, marginBottom: 8 }}>How can we help?</h1>
          <p className="page-subtitle" style={{ fontSize: 16, maxWidth: 600 }}>Get assistance with PhantomAPI configuration, report an incident, or join our community of security-minded developers.</p>
        </div>
      </div>

      <div className="page-body" style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        
        {/* Support Channels */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) minmax(300px, 1fr)', gap: 24 }}>
          <a href="mailto:support@phantomapi.dev" className="card fade-up hover-expand" style={{ display: 'flex', flexDirection: 'column', padding: 32, textDecoration: 'none', background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(20,20,20,0) 100%)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
              <Mail size={24} color="var(--text-primary)" />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>Priority Support</h3>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, flex: 1, marginBottom: 20 }}>Reach out directly to our security engineering team. We guarantee a response within 24 hours.</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--accent)', fontSize: 13, fontWeight: 600 }}>Message Team <ArrowRight size={14} /></div>
          </a>

          <a href="https://discord.gg/phantomapi" target="_blank" rel="noreferrer" className="card fade-up hover-expand" style={{ animationDelay: '0.1s', display: 'flex', flexDirection: 'column', padding: 32, textDecoration: 'none', background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(20,20,20,0) 100%)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(88,101,242,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
              <MessageCircle size={24} color="#5865F2" />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>Developer Discord</h3>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, flex: 1, marginBottom: 20 }}>Join active discussions, ask questions in real-time, and get community-driven answers instantly.</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#5865F2', fontSize: 13, fontWeight: 600 }}>Join Server <ExternalLink size={14} /></div>
          </a>
        </div>

        {/* Knowledge Base */}
        <div className="card fade-up" style={{ animationDelay: '0.2s', padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)' }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 10 }}>
              <HelpCircle size={18} color="var(--accent)" /> Technical Troubleshooting
            </h2>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', gap: 16 }}>
                <AlertTriangle size={20} color="var(--red)" style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>MCP Disconnections & Parsing Errors</h4>
                  <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>If your agent stops responding or throws `EOF` errors, typically your Terminal session dropped the connection. Verify that the <code>PHANTOMAPI_TOKEN</code> corresponds exactly to a non-revoked token in your <a href="/mcp" style={{ color: 'var(--accent)' }}>dashboard</a>. Restarting Claude Desktop completely flushes local caches.</p>
                </div>
              </div>
            </div>

            <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', gap: 16 }}>
                <LockKeyhole size={20} color="var(--red)" style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>Root Password Recovery</h4>
                  <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>Because PhantomAPI employs Zero-Knowledge architecture, we never transmit your password unhashed. If you lose your master credentials, our team has <strong style={{ color: 'var(--red)' }}>zero operational ability</strong> to reset or recover your encrypted entries.</p>
                </div>
              </div>
            </div>
            
            <div style={{ padding: '24px 32px' }}>
              <div style={{ display: 'flex', gap: 16 }}>
                <Shield size={20} color="var(--cyan)" style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>Understanding Access Logs</h4>
                  <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>All automated reads trigger an audit log. If you notice unexpected rapid reads, a rogue script or compromised plugin in your IDE might be polling the endpoint. You can instantly mitigate this by revoking the MCP token.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
