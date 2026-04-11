'use client'
import { useEffect, useState, useCallback } from 'react'
import { SecretIcon, CATEGORIES } from '@/lib/branding'
import { Search, SearchX, LockKeyhole, Copy, Eye, EyeOff, Edit2, Trash2, Plus, Calendar, Clock, ShieldCheck, Key } from 'lucide-react'








interface Secret {
  id: string; name: string; service: string; description?: string
  createdAt: string; updatedAt: string; lastAccessed?: string
}
interface SecretDetail extends Secret { value: string }

function getCategoryInfo(id: string) {
  return CATEGORIES.find(c => c.id === id) || CATEGORIES[CATEGORIES.length - 1]
}


function timeAgo(d: string) {
  const diff = Date.now() - new Date(d).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  return `${Math.floor(m / 60)}h ago`
}

export default function VaultPage() {
  const [secrets, setSecrets] = useState<Secret[]>([])
  const [selected, setSelected] = useState<Secret | null>(null)
  const [detail, setDetail] = useState<SecretDetail | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [detailLoading, setDetailLoading] = useState(false)
  const [showAdd, setShowAdd] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [toast, setToast] = useState<{ msg: string; type: string } | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState(false)

  // Add form state
  const [addName, setAddName] = useState('')
  const [addValue, setAddValue] = useState('')
  const [addService, setAddService] = useState('custom')
  const [addDesc, setAddDesc] = useState('')
  const [addLoading, setAddLoading] = useState(false)

  // Edit form state
  const [editValue, setEditValue] = useState('')
  const [editDesc, setEditDesc] = useState('')
  const [editLoading, setEditLoading] = useState(false)

  function showToast(msg: string, type = 'info') {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }

  const loadSecrets = useCallback(async () => {
    setLoading(true)
    const res = await fetch(`/api/secrets?search=${encodeURIComponent(search)}`)
    const data = await res.json()
    setSecrets(data.secrets || [])
    setLoading(false)
  }, [search])

  useEffect(() => { loadSecrets() }, [loadSecrets])

  async function selectSecret(s: Secret) {
    setSelected(s)
    setRevealed(false)
    setDetail(null)
    setDeleteConfirm(false)
    setDetailLoading(true)
    const res = await fetch(`/api/secrets/${s.id}`)
    const data = await res.json()
    setDetail(data.secret || null)
    setDetailLoading(false)
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setAddLoading(true)
    try {
      const res = await fetch('/api/secrets', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: addName, value: addValue, service: addService, description: addDesc }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      showToast('Secret added successfully', 'success')
      setShowAdd(false); setAddName(''); setAddValue(''); setAddService('custom'); setAddDesc('')
      await loadSecrets()
    } catch (err: any) {
      showToast(err.message, 'error')
    } finally { setAddLoading(false) }
  }

  async function handleEdit(e: React.FormEvent) {
    e.preventDefault()
    if (!selected) return
    setEditLoading(true)
    try {
      const body: any = { description: editDesc }
      if (editValue) body.value = editValue
      const res = await fetch(`/api/secrets/${selected.id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error('Update failed')
      showToast('Secret updated', 'success')
      setShowEdit(false)
      await loadSecrets()
      await selectSecret(selected)
    } catch (err: any) {
      showToast(err.message, 'error')
    } finally { setEditLoading(false) }
  }

  async function handleDelete() {
    if (!selected) return
    const res = await fetch(`/api/secrets/${selected.id}`, { method: 'DELETE' })
    if (res.ok) {
      showToast('Secret deleted', 'success')
      setSelected(null); setDetail(null)
      await loadSecrets()
    } else {
      showToast('Delete failed', 'error')
    }
  }

  async function copyToClipboard(v: string, secretId?: string) {
    navigator.clipboard.writeText(v)
    showToast('Copied to clipboard!', 'success')
    if (secretId) {
      try {
        await fetch('/api/logs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'copy', secretId }),
        })
      } catch (err) {
        console.error('Logging failed:', err)
      }
    }
  }

  const filtered = secrets.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) || s.service.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      {/* Toast */}
      {toast && (
        <div className="toast-container">
          <div className={`toast toast-${toast.type}`}>
            {toast.type === 'success' ? '✓' : toast.type === 'error' ? '✕' : 'ℹ'} {toast.msg}
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAdd && (
        <div className="modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Add New Secret</h2>
              <button className="modal-close" onClick={() => setShowAdd(false)}>✕</button>
            </div>
            <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div className="input-group">
                <label className="input-label">Node Taxonomy (Category)</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, marginTop: 10 }}>
                  {CATEGORIES.map(c => (
                    <button key={c.id} type="button"
                      onClick={() => setAddService(c.id)}
                      style={{
                        padding: '10px 4px', borderRadius: 'var(--radius-md)', border: '1px solid',
                        borderColor: addService === c.id ? 'var(--accent)' : 'var(--border)',
                        background: addService === c.id ? 'var(--accent-dim)' : 'var(--bg-input)',
                        cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                        fontSize: 12, fontWeight: 500, color: addService === c.id ? 'var(--accent)' : 'var(--text-secondary)',
                      }}>
                      <span style={{ transform: 'scale(0.95)' }}>{c.icon}</span>{c.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="input-group">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                  <label className="input-label" htmlFor="add-name" style={{ marginBottom: 0 }}>Secret Identifier</label>
                </div>
                <input id="add-name" className="input" value={addName} onChange={e => setAddName(e.target.value)} placeholder="e.g. OPENAI_API_KEY" required />
              </div>
              <div className="input-group">
                <label className="input-label" htmlFor="add-value">Secret Value</label>
                <input id="add-value" className="input" type="password" value={addValue} onChange={e => setAddValue(e.target.value)} placeholder="sk-••••••••••••••••" required />
              </div>
              <div className="input-group">
                <label className="input-label" htmlFor="add-desc">Description (optional)</label>
                <input id="add-desc" className="input" value={addDesc} onChange={e => setAddDesc(e.target.value)} placeholder="Production key for OpenAI" />
              </div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
                <button type="button" className="btn btn-ghost" onClick={() => setShowAdd(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={addLoading}>
                  {addLoading ? <><span className="spinner" /> Saving…</> : <><Key size={14} style={{ marginRight: 8 }} /> ADD_SECRET</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEdit && selected && (
        <div className="modal-overlay" onClick={() => setShowEdit(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Edit — {selected.name}</h2>
              <button className="modal-close" onClick={() => setShowEdit(false)}>✕</button>
            </div>
            <form onSubmit={handleEdit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="input-group">
                <label className="input-label">New Value (leave blank to keep current)</label>
                <input className="input" type="password" value={editValue} onChange={e => setEditValue(e.target.value)} placeholder="••••••••••••" />
              </div>
              <div className="input-group">
                <label className="input-label">Description</label>
                <input className="input" value={editDesc} onChange={e => setEditDesc(e.target.value)} placeholder="Description" />
              </div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-ghost" onClick={() => setShowEdit(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={editLoading}>
                  {editLoading ? <><span className="spinner" /> Saving…</> : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Vault Unified Workspace */}
      <div className="vault-container">
        {/* Top Bar (Unified Search & Actions) */}
        <div className="vault-topbar">
          <div className="vault-search-wrapper">
            <Search size={18} style={{ opacity: 0.5 }} />
            <input
              placeholder="Search in all secrets (name, service, tags)..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => setShowAdd(true)}>
            <Plus size={16} style={{ marginRight: 8 }} /> NEW_SECRET
          </button>
        </div>

        <div className="vault-content">
          {/* Master List */}
          <div className="vault-list">
            <div className="vault-list-header">
              <span className="vault-list-title">All Secured Items</span>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{filtered.length} total</span>
            </div>
            <div className="vault-list-body">
              {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
                  <div className="spinner" style={{ width: 24, height: 24 }} />
                </div>
              ) : filtered.length === 0 ? (
                <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12, opacity: 0.5 }}>
                    <SearchX size={48} strokeWidth={1} />
                  </div>
                  {search ? 'No matches found' : 'No secrets yet'}
                  {!search && (
                    <div style={{ marginTop: 12 }}>
                      <button className="btn btn-primary btn-sm" onClick={() => setShowAdd(true)}><Plus size={14} style={{ marginRight: 4 }} /> Add your first</button>
                    </div>
                  )}
                </div>
              ) : filtered.map(s => {
                return (
                  <div key={s.id} className={`vault-item ${selected?.id === s.id ? 'selected' : ''}`} onClick={() => selectSecret(s)}>
                    <div className="vault-item-icon">
                      <SecretIcon name={s.name} categoryId={s.service} size={24} />
                    </div>
                    <div>
                      <div className="vault-item-name data-value">{s.name}</div>
                      <div className="vault-item-service mono" style={{ opacity: 0.7 }}>
                        {getCategoryInfo(s.service).label} · {timeAgo(s.updatedAt)}
                      </div>
                    </div>
                  </div>
                )
              })}

            </div>
          </div>

          {/* Right Detail Panel */}
          <div className="vault-detail">
            {!selected ? (
              <div className="vault-empty">
                <div className="vault-empty-icon pulse-green" style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
                  <LockKeyhole size={64} strokeWidth={1} color="var(--accent)" style={{ opacity: 0.2 }} />
                </div>
                <p style={{ fontSize: 16, fontWeight: 600 }} className="decipher">Workspace Locked</p>
                <p className="decipher" style={{ fontSize: 13, animationDelay: '0.1s' }}>Select a node from the left to view credentials</p>
              </div>
            ) : detailLoading ? (
              <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 80 }}>
                <div className="spinner" style={{ width: 32, height: 32 }} />
              </div>
            ) : detail ? (
              <div className="fade-in" style={{ width: '100%' }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div className="vault-item-icon" style={{ width: 48, height: 48, borderRadius: 14 }}>
                      <SecretIcon name={detail.name} categoryId={detail.service} size={28} />
                    </div>
                    <div>
                      <h2 className="vault-detail-title">{detail.name}</h2>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                        <span className="badge badge-accent">{getCategoryInfo(detail.service).label}</span>
                        {detail.description && <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{detail.description}</span>}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => { setEditDesc(detail.description || ''); setEditValue(''); setShowEdit(true) }}><Edit2 size={14} style={{ marginRight: 6 }} />Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => setDeleteConfirm(true)}><Trash2 size={14} style={{ marginRight: 6 }} />Delete</button>
                  </div>
                </div>

                {/* Value */}
                <div className="card" style={{ marginBottom: 20, minWidth: 0 }}>
                  <div className="vault-list-title" style={{ marginBottom: 12, fontSize: 11 }}>Access Credential</div>
                  <div className="key-value-row" style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                    <div className="key-masked mono" style={{
                      flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      background: 'rgba(255,255,255,0.02)', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border)',
                      minWidth: 0, wordBreak: 'break-all'
                    }}>
                      {revealed ? detail.value : '•'.repeat(Math.min(detail.value.length, 30))}
                    </div>
                    <button className="btn btn-ghost btn-sm" onClick={() => setRevealed(r => !r)} style={{ padding: '0 12px', height: 36, flexShrink: 0 }}>
                      {revealed ? <><EyeOff size={14} style={{ marginRight: 6 }} />Hide</> : <><Eye size={14} style={{ marginRight: 6 }} />Reveal</>}
                    </button>
                    <button className="btn btn-secondary btn-sm" onClick={() => copyToClipboard(detail.value, detail.id)} style={{ padding: '0 12px', height: 36, flexShrink: 0 }}>
                      <Copy size={14} style={{ marginRight: 6 }} />Copy
                    </button>
                  </div>
                </div>

                {/* Digital Identity Metadata */}
                <div className="card" style={{ marginBottom: 20, padding: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>Security Identity</div>
                    <div className="badge badge-green" style={{ fontSize: 9, padding: '2px 8px', border: '1px solid rgba(0,255,65,0.2)', letterSpacing: '0.02em' }}>
                      <ShieldCheck size={10} style={{ marginRight: 4 }} /> AES-256 SECURED
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {[
                      { label: 'System Origin', value: getCategoryInfo(detail.service).label, icon: <LockKeyhole size={14} /> },

                      { label: 'Initial Creation', value: new Date(detail.createdAt).toLocaleDateString(), icon: <Calendar size={14} /> },
                      { label: 'Last Modification', value: new Date(detail.updatedAt).toLocaleDateString(), icon: <Clock size={14} /> },
                      { label: 'Last Known Access', value: detail.lastAccessed ? timeAgo(detail.lastAccessed) : 'Never Detected', icon: <Eye size={14} /> },
                    ].map((m, idx) => (
                      <div key={m.label} style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        paddingBottom: idx === 3 ? 0 : 12,
                        borderBottom: idx === 3 ? 'none' : '1px solid rgba(255,255,255,0.03)'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ color: 'var(--text-muted)', display: 'flex' }}>{m.icon}</div>
                          <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{m.label}</span>
                        </div>
                        <span className="mono" style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 500 }}>{m.value}</span>
                      </div>
                    ))}
                  </div>
                </div>


                {/* Delete confirm */}
                {deleteConfirm && (
                  <div className="card" style={{ border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.05)' }}>
                    <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 16 }}>
                      Are you sure you want to delete <strong style={{ color: 'var(--text-primary)' }}>{detail.name}</strong>? This action cannot be undone.
                    </p>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-danger btn-sm" onClick={handleDelete}>Delete permanently</button>
                      <button className="btn btn-ghost btn-sm" onClick={() => setDeleteConfirm(false)}>Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>

    </>
  )
}
