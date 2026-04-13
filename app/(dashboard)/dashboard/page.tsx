'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Stats { secrets: number; logs: number; tokens: number }
interface Log { id: string; action: string; source: string; createdAt: string; secret?: { name: string; service: string } | null; ipAddress?: string }

import { SecretIcon } from '@/lib/branding'
import { PlusCircle, Eye, Pencil, Trash2, Cpu, KeyRound, Activity, ShieldCheck, Mailbox, Globe, Terminal, Code2, Copy } from 'lucide-react'

const ACTION_COLORS: Record<string, string> = {
  create: 'badge-cyan', read: 'badge-accent', update: 'badge-amber',
  delete: 'badge-red', mcp_read: 'badge-cyan', mcp_list: 'badge-cyan',
  mcp_write: 'badge-amber', create_token: 'badge-cyan', delete_token: 'badge-red'
}
const ACTION_LABELS: Record<string, string> = {
  create: 'Created API Key', read: 'Viewed Secret', update: 'Updated Key', delete: 'Deleted Secret',
  mcp_read: 'MCP Data Read', mcp_list: 'MCP Network Sync', mcp_write: 'MCP Data Write',
  create_token: 'Generated Token', delete_token: 'Revoked Token',
  'mcp_proxy_openai_chat.completions': 'AI Request',
  copy: 'Copied'
}

const ACTION_ICONS: Record<string, React.ReactNode> = {
  create: <PlusCircle size={14} />, read: <Eye size={14} />, update: <Pencil size={14} />, delete: <Trash2 size={14} />,
  mcp_read: <Cpu size={14} />, mcp_list: <Cpu size={14} />, mcp_write: <Cpu size={14} />,
  create_token: <PlusCircle size={14} />, delete_token: <Trash2 size={14} />
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({ secrets: 0, logs: 0, tokens: 0 })
  const [logs, setLogs] = useState<Log[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/secrets').then(r => r.json()),
      fetch('/api/logs?limit=20').then(r => r.json()),
      fetch('/api/mcp/token').then(r => r.json()),
    ]).then(([s, l, t]) => {
      setStats({ secrets: s.secrets?.length ?? 0, logs: l.logs?.length ?? 0, tokens: t.tokens?.length ?? 0 })
      setLogs(l.logs ?? [])
    }).finally(() => setLoading(false))
  }, [])

  const STATS = [
    { label: 'Stored Secrets', value: stats.secrets, icon: <KeyRound size={22} />, color: 'var(--accent)' },
    { label: 'Events (24h)', value: stats.logs, icon: <Activity size={22} />, color: 'var(--accent)' },
    { label: 'MCP Tokens', value: stats.tokens, icon: <Cpu size={22} />, color: 'var(--accent)' },
    { label: 'Security Score', value: '100%', icon: <ShieldCheck size={22} />, color: 'var(--amber)' },
  ]

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title decipher">Dashboard</h1>
          <p className="page-subtitle decipher" style={{ animationDelay: '0.1s' }}>Secure overview of your digital assets and system activity</p>
        </div>
        <Link href="/vault" className="btn btn-primary">+ Add Secret</Link>
      </div>

      <div className="page-body">
        {/* Stats */}
        <div className="stats-grid" style={{ marginBottom: 28 }}>
          {STATS.map(s => (
            <div key={s.label} className="stat-card fade-up">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontSize: 22 }}>{s.icon}</span>
                <span className="badge badge-muted pulse-cyan">Live</span>
              </div>
              <div className="stat-value data-value" style={{ color: s.color }}>{loading ? '—' : s.value}</div>
              <div className="stat-label" style={{ letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: 11, opacity: 0.8 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Main Split Content */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

          {/* Simple SDK Card (Left) */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            background: 'linear-gradient(180deg, rgba(20, 20, 20, 0.4) 0%, rgba(10, 10, 10, 0.4) 100%)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.05)'
          }} className="card fade-up">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h2 style={{ fontSize: 16, fontWeight: 300, display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-primary)' }}>
                <Terminal size={18} style={{ color: 'var(--accent)', opacity: 0.9 }} /> Developer Toolkit
              </h2>
              <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--accent)', background: 'rgba(0, 250, 154, 0.05)', padding: '2px 8px', borderRadius: 4, border: '1px solid rgba(0, 250, 154, 0.1)' }}>v1.0.1</span>
            </div>

            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20, lineHeight: 1.5 }}>
              The secure gateway to your secrets from any environment.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 0 }}>
              {[
                'npm i -g @phantomapi/cli',
                'phantomapi login <TOKEN>',
                'phantomapi get firebase'
              ].map((cmd, i) => (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  background: 'rgba(255,255,255,0.02)',
                  padding: '10px 12px',
                  borderRadius: 8,
                  border: '1px solid rgba(255,255,255,0.03)'
                }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-primary)', width: 14, opacity: 0.8 }}>{i + 1}</div>
                  <div className="mono" style={{ fontSize: 12.5, color: '#bcc4d0', letterSpacing: '-0.2px' }}>
                    <span style={{ color: 'var(--accent)', marginRight: 6 }}>$</span>{cmd}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity (Right) */}
          <div className="card fade-up" style={{ animationDelay: '0.15s', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h2 style={{ fontSize: 16, fontWeight: 300 }}>Recent Activity</h2>
              <Link href="/logs" className="btn btn-ghost btn-sm">View all →</Link>
            </div>
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: 20 }}>
                <div className="spinner" style={{ width: 24, height: 24 }} />
              </div>
            ) : logs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text-muted)' }}>
                <p>No activity yet.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                {logs.slice(0, 3).map((log, index, arr) => (
                  <div key={log.id} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '12px 0', borderBottom: index === arr.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.04)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: 8,
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'var(--accent)', flexShrink: 0
                      }}>
                        <span style={{ fontSize: 13, fontWeight: 800 }}>{'>_'}</span>
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                            {ACTION_LABELS[log.action] || log.action}
                          </span>
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>
                          {log.secret?.name || (log.action === 'copy' && log.source === 'web_mcp' ? 'MCP Access Key' : 'System')} · {log.source === 'web_mcp' ? 'MCP' : (log.source === 'mcp' ? 'AI' : 'Web')}
                        </div>
                      </div>
                    </div>
                    <div className="mono" style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                      {timeAgo(log.createdAt)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick actions */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 20 }}>
          <div className="card fade-up" style={{ animationDelay: '0.15s' }}>
            <h3 style={{ fontSize: 15, fontWeight: 300, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
              <KeyRound size={16} className="text-accent" /> Vault
            </h3>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>Add and manage your encrypted API keys</p>
            <Link href="/vault" className="btn btn-secondary btn-sm">Open Vault →</Link>
          </div>
          <div className="card fade-up" style={{ animationDelay: '0.2s' }}>
            <h3 style={{ fontSize: 15, fontWeight: 300, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Cpu size={16} className="text-cyan" /> MCP Integration
            </h3>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>Let AI agents fetch your credentials automatically</p>
            <Link href="/mcp" className="btn btn-secondary btn-sm">Configure MCP →</Link>
          </div>
        </div>
      </div>
    </>
  )
}
