'use client'
import { useEffect, useState } from 'react'
import { SecretIcon } from '@/lib/branding'
import { Bot, Mailbox, Globe } from 'lucide-react'

interface Log {
  id: string; action: string; source: string; createdAt: string
  ipAddress?: string; userAgent?: string
  secret?: { name: string; service: string } | null
}

const ACTION_COLORS: Record<string, string> = {
  create: 'badge-green', read: 'badge-accent', update: 'badge-amber',
  delete: 'badge-red', mcp_read: 'badge-cyan', mcp_list: 'badge-cyan', mcp_write: 'badge-amber',
  create_token: 'badge-green', delete_token: 'badge-red'
}
const ACTION_LABELS: Record<string, string> = {
  create: 'Created', read: 'Viewed', update: 'Updated', delete: 'Deleted',
  mcp_read: 'MCP Read', mcp_list: 'MCP List', mcp_write: 'MCP Write',
  create_token: 'Token Gen', delete_token: 'Token Revoked'
}

export default function LogsPage() {
  const [logs, setLogs] = useState<Log[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/logs?limit=100').then(r => r.json()).then(d => {
      setLogs(d.logs || [])
      setLoading(false)
    })
  }, [])

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title decipher">Access Logs</h1>
          <p className="page-subtitle decipher" style={{ animationDelay: '0.1s' }}>Every secret access, fully audited</p>
        </div>
        <span className="badge badge-green pulse-green" style={{ alignSelf: 'center' }}>● Live</span>
      </div>
      <div className="page-body">
        <div className="card card-flush fade-up">
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
              <div className="spinner" style={{ width: 32, height: 32 }} />
            </div>
          ) : logs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16, opacity: 0.3 }}><Mailbox size={48} /></div>
              <p className="mono">{'>'} NO_ACCESS_LOGS_FOUND.</p>
            </div>
          ) : (
            <div className="table-wrap" style={{
              background: 'transparent',
              borderRadius: 'inherit',
              border: 'none',
              overflow: 'hidden'
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border-color)' }}>
                    <th style={{ padding: '16px 24px', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', fontWeight: 600 }}>Action</th>
                    <th style={{ padding: '16px 24px', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', fontWeight: 600 }}>Target</th>
                    <th style={{ padding: '16px 24px', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', fontWeight: 600 }}>Source Client</th>
                    <th style={{ padding: '16px 24px', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', fontWeight: 600 }}>IP Origin</th>
                    <th style={{ padding: '16px 24px', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', fontWeight: 600, textAlign: 'right' }}>Date & Time</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log, index) => (
                    <tr key={log.id} style={{ borderBottom: index === logs.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ padding: '16px 24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          {log.source === 'mcp' ? <Bot size={14} color="var(--cyan)" /> : <Globe size={14} color="var(--text-muted)" />}
                          <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>
                            {ACTION_LABELS[log.action] || log.action}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        {log.secret ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <SecretIcon name={log.secret.name} categoryId={log.secret.service} size={16} />
                            <span style={{ color: 'var(--text-primary)', fontWeight: 500, fontSize: 13, letterSpacing: '-0.01em' }}>{log.secret.name}</span>
                          </div>
                        ) : (
                          <span className="badge badge-muted" style={{ padding: '2px 8px', fontSize: 11, opacity: 0.7, border: '1px solid rgba(255,255,255,0.1)' }}>
                            System Profile
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <span className={`badge ${log.source === 'mcp' ? 'badge-cyan' : 'badge-muted'}`} style={{ fontSize: 11 }}>
                          {log.source === 'mcp' ? 'AI / MCP Plugin' : 'Web Console'}
                        </span>
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <span className="mono" style={{ fontSize: 12, color: 'var(--text-muted)', opacity: 0.8 }}>
                          {log.ipAddress === '::1' || log.ipAddress === '127.0.0.1' ? 'Local System' : (log.ipAddress || '—')}
                        </span>
                      </td>
                      <td style={{ padding: '16px 24px', fontSize: 12, color: 'var(--text-muted)', textAlign: 'right' }}>
                        {new Date(log.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
