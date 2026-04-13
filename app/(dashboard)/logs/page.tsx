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
  create: 'badge-cyan', read: 'badge-accent', update: 'badge-amber',
  delete: 'badge-red', mcp_read: 'badge-cyan', mcp_list: 'badge-cyan', mcp_write: 'badge-amber',
  create_token: 'badge-cyan', delete_token: 'badge-red'
}
const ACTION_LABELS: Record<string, string> = {
  create: 'Created', read: 'Viewed', update: 'Updated', delete: 'Deleted',
  mcp_read: 'MCP Read', mcp_list: 'MCP List', mcp_write: 'MCP Write',
  create_token: 'Token Gen', delete_token: 'Token Revoked',
  'mcp_proxy_openai_chat.completions': 'AI Request',
  copy: 'Copied'
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
        <span className="badge badge-cyan pulse-cyan" style={{ alignSelf: 'center' }}>● Live</span>
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
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', tableLayout: 'fixed' }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border-color)' }}>
                    <th style={{ padding: '16px 24px', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', fontWeight: 500, width: '20%' }}>Action</th>
                    <th style={{ padding: '16px 24px', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', fontWeight: 500, width: '20%' }}>Target Identity</th>
                    <th style={{ padding: '16px 24px', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', fontWeight: 500, width: '20%' }}>Source Client</th>
                    <th style={{ padding: '16px 24px', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', fontWeight: 500, width: '20%' }}>Ip Origin</th>
                    <th style={{ padding: '16px 24px', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', fontWeight: 500, width: '20%' }}>Date & Time</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log, index) => (
                    <tr key={log.id} style={{ borderBottom: index === logs.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ padding: '20px 24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <Globe size={16} className="text-muted" style={{ opacity: 0.6 }} />
                          <span style={{ fontSize: 14, fontWeight: 400, color: 'var(--text-primary)' }}>
                            {ACTION_LABELS[log.action] || log.action}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '20px 24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{ 
                            width: 26, 
                            height: 26, 
                            background: 'rgba(0, 229, 255, 0.02)', 
                            border: '1px solid rgba(0, 229, 255, 0.15)', 
                            borderRadius: 6, 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            color: '#fff'
                          }}>
                             <span style={{ fontSize: 11, fontWeight: 400, fontFamily: 'var(--font-mono)' }}>{'>_'}</span>
                          </div>
                          <span style={{ color: 'var(--text-primary)', fontWeight: 400, fontSize: 14 }}>
                            {log.secret?.name || (log.action === 'copy' && log.source === 'web_mcp' ? 'MCP Access Key' : 'System Core')}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '20px 24px' }}>
                        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '6px 14px', borderRadius: 20, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                           <span style={{ fontSize: 10, fontWeight: 500, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                             {log.source === 'mcp' ? 'MCP CONSOLE' : 'WEB CONSOLE'}
                           </span>
                        </div>
                      </td>
                      <td style={{ padding: '20px 24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                           <span style={{ fontSize: 13, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>Local System</span>
                        </div>
                      </td>
                      <td style={{ padding: '20px 24px', fontSize: 13, color: 'var(--text-muted)' }}>
                        {new Date(log.createdAt).toLocaleString([], { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
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
