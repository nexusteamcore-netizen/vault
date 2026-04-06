import Link from 'next/link'
import { Lock, Zap, Cpu, History, RefreshCcw, Users, TerminalSquare } from 'lucide-react'

const FEATURES = [
  { icon: <Lock size={20} className="matrix-icon" />, title: 'AES-256-GCM Encryption', desc: 'Every secret is encrypted at rest using military-grade AES-256-GCM. Your keys are unreadable without your master encryption key.' },
  { icon: <Zap size={20} className="matrix-icon" />, title: 'Instant API Access', desc: 'Fetch any credential via a single authenticated API call. No more hardcoded keys in .env files or git history.' },
  { icon: <Cpu size={20} className="matrix-icon" />, title: 'MCP for AI Agents', desc: 'First-class Model Context Protocol support. Let Claude, Cursor, or any AI agent fetch credentials automatically.' },
  { icon: <History size={20} className="matrix-icon" />, title: 'Full Audit Logs', desc: 'Every access is logged with timestamp, IP address, and source. Know exactly who accessed which key and when.' },
  { icon: <RefreshCcw size={20} className="matrix-icon" />, title: 'Key Rotation Ready', desc: 'Update a single key and all your services get the new value instantly. Zero downtime secret rotation.' },
  { icon: <Users size={20} className="matrix-icon" />, title: 'Team Vaults', desc: 'Share vaults across your team with granular permissions. Coming soon: SSO, SCIM, and enterprise compliance.' },
]

const SERVICES = ['OpenAI', 'Stripe', 'AWS', 'GitHub', 'Twilio', 'Slack', 'Anthropic', 'Vercel']

import MatrixRain from '@/components/MatrixRain'

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      <MatrixRain />
      {/* Nav */}
      <nav className="landing-nav">
        <div className="landing-nav-logo boot-text">
          <TerminalSquare size={20} className="blink" />
          <span style={{ marginLeft: 8, letterSpacing: '0.1em' }}>VAULTIX_</span>
        </div>
        <div className="landing-nav-links">
          <a href="#features" className="landing-nav-link">Features</a>
          <a href="#pricing" className="landing-nav-link">Pricing</a>
          <a href="#mcp" className="landing-nav-link">MCP</a>
        </div>
        <div className="landing-nav-actions">
          <Link href="/login" className="btn btn-ghost btn-sm">Sign in</Link>
          <Link href="/register" className="btn btn-primary btn-sm">Get started free</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
        <div className="hero-badge" style={{ position: 'relative', zIndex: 1, fontFamily: 'monospace' }}>
          <span>{'>_'}</span> THE PICKS-AND-SHOVELS PLAY FOR THE AI ERA
        </div>
        <h1 className="hero-title" style={{ position: 'relative', zIndex: 1 }}>
          Your secret vault for<br /><span>every API key</span>
        </h1>
        <p className="hero-subtitle" style={{ position: 'relative', zIndex: 1 }}>
          1Password for developers. Store, manage, and serve all your API credentials with AES-256 encryption — and let AI agents fetch them via MCP.
        </p>
        <div className="hero-actions" style={{ position: 'relative', zIndex: 1 }}>
          <Link href="/register" className="btn btn-primary btn-lg">
            Start free → free forever
          </Link>
          <Link href="/login" className="btn btn-ghost btn-lg">
            Sign in
          </Link>
        </div>
        <div className="hero-logos" style={{ position: 'relative', zIndex: 1, flexDirection: 'column', gap: 24 }}>
          <span style={{ fontSize: 13, color: 'var(--text-muted)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Trusted by teams using</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 40, flexWrap: 'wrap', justifyContent: 'center' }}>
            {SERVICES.map(s => (
              <span key={s} style={{ fontSize: 14, color: 'var(--text-secondary)', fontWeight: 500 }}>{s}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features-section" id="features">
        <div className="section-tag">
          <span className="badge badge-accent">Features</span>
        </div>
        <h2 className="section-title">Everything you need to manage<br />secrets at scale</h2>
        <p className="section-sub">Built for developers who care about security without sacrificing developer experience.</p>
        <div className="features-grid">
          {FEATURES.map(f => (
            <div key={f.title} className="feature-card fade-up">
              <div className="feature-icon">{f.icon}</div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* MCP Section */}
      <section id="mcp" style={{ padding: '80px 48px', background: 'var(--bg-surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
          <div>
            <span className="badge badge-green" style={{ marginBottom: 16 }}>MCP Integration</span>
            <h2 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 16 }}>
              Let your AI agents fetch secrets automatically
            </h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 24 }}>
              Vaultix ships a first-class Model Context Protocol server. Add one line to your Claude Desktop or Cursor config and your AI assistant can securely retrieve any credential on demand — no more copy-pasting keys.
            </p>
            <Link href="/register" className="btn btn-primary">Get your MCP endpoint →</Link>
          </div>
          <div style={{ background: 'var(--bg-base)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: 24 }}>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12, fontFamily: 'monospace' }}>claude_desktop_config.json</div>
            <pre className="mono" style={{ color: 'var(--accent)', fontSize: 12, lineHeight: 1.8, overflow: 'auto' }}>{`{
  "mcpServers": {
    "vaultix": {
      "command": "npx",
      "args": ["-y", "vaultix-mcp"],
      "env": {
        "VAULTIX_TOKEN": "vtx_••••••••"
      }
    }
  }
}`}</pre>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="pricing-section" id="pricing">
        <div className="section-tag">
          <span className="badge badge-green">Pricing</span>
        </div>
        <h2 className="section-title">Simple, transparent pricing</h2>
        <p className="section-sub">Start free. Upgrade when you're ready.</p>
        <div className="pricing-grid">
          {[
            { plan: 'Hobby', price: '$0', period: '/mo', features: ['Up to 25 secrets', '1 user', 'Basic audit log', 'API access', 'MCP integration'], cta: 'Start free', href: '/register', popular: false },
            { plan: 'Pro', price: '$19', period: '/mo', features: ['Unlimited secrets', '1 user', 'Full audit log & exports', 'Priority support', 'MCP + AI agent access', 'Key rotation alerts'], cta: 'Get Pro', href: '/register', popular: true },
            { plan: 'Team', price: '$49', period: '/mo', features: ['Everything in Pro', 'Up to 10 users', 'Shared vaults', 'RBAC permissions', 'Slack notifications', 'SSO (coming soon)'], cta: 'Get Team', href: '/register', popular: false },
          ].map(p => (
            <div key={p.plan} className={`pricing-card ${p.popular ? 'popular' : ''}`}>
              {p.popular && <div className="pricing-popular-badge">Most Popular</div>}
              <div className="pricing-plan">{p.plan}</div>
              <div className="pricing-price">{p.price}<span>{p.period}</span></div>
              <ul className="pricing-features">
                {p.features.map(f => <li key={f}>{f}</li>)}
              </ul>
              <Link href={p.href} className={`btn ${p.popular ? 'btn-primary' : 'btn-ghost'}`} style={{ width: '100%', justifyContent: 'center' }}>
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="landing-nav-logo boot-text" style={{ fontSize: 14 }}>
          <TerminalSquare size={16} />
          <span style={{ marginLeft: 8, letterSpacing: '0.1em' }}>VAULTIX_</span>
        </div>
        <span>© 2025 Vaultix. Built for developers, by developers.</span>
        <div style={{ display: 'flex', gap: 24 }}>
          <a href="#" style={{ color: 'var(--text-muted)', fontSize: 13 }}>Privacy</a>
          <a href="#" style={{ color: 'var(--text-muted)', fontSize: 13 }}>Terms</a>
          <a href="#" style={{ color: 'var(--text-muted)', fontSize: 13 }}>Docs</a>
        </div>
      </footer>
    </div>
  )
}
