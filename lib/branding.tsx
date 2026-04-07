import React from 'react'
import { 
  Bot, CreditCard, Cloud, GitBranch, Triangle, Phone, Mail, Key, Brain,
  Database, Shield, Zap, Terminal, Code, Layout, MessageSquare, Coffee
} from 'lucide-react'

export const CATEGORIES = [
  { id: 'ai', label: 'AI / RL', icon: <Brain size={16} />, className: 'service-openai' },
  { id: 'payments', label: 'Finance', icon: <CreditCard size={16} />, className: 'service-stripe' },
  { id: 'database', label: 'Database', icon: <Database size={16} />, className: 'service-github' },
  { id: 'cloud', label: 'Cloud / Inf', icon: <Cloud size={16} />, className: 'service-aws' },
  { id: 'devtools', label: 'DevTools', icon: <Terminal size={16} />, className: 'service-github' },
  { id: 'comms', label: 'Comms', icon: <MessageSquare size={16} />, className: 'service-aws' },
  { id: 'messaging', label: 'Email', icon: <Mail size={16} />, className: 'service-openai' },
  { id: 'custom', label: 'Custom', icon: <Key size={16} />, className: 'service-custom' },
]

export const BRAND_MAP: Record<string, string> = {
  // AI & ML (The heavy hitters)
  'openai': 'openai.com', 'anthropic': 'anthropic.com', 'google': 'google.com', 'microsoft': 'microsoft.com',
  'gemini': 'gemini.google.com', 'vertex': 'cloud.google.com', 'claude': 'anthropic.com', 'meta': 'meta.com',
  'huggingface': 'huggingface.co', 'cohere': 'cohere.ai', 'mistral': 'mistral.ai', 'elevenlabs': 'elevenlabs.io',
  'pinecone': 'pinecone.io', 'langchain': 'langchain.com', 'midjourney': 'midjourney.com', 'groq': 'groq.com',
  'stability': 'stability.ai', 'perplexity': 'perplexity.ai', 'nvidia': 'nvidia.com', 'jasper': 'jasper.ai',
  
  // Cloud & Infrastructure (The Backbone)
  'aws': 'amazonaws.com', 'amazon': 'amazon.com', 'azure': 'azure.microsoft.com', 'gcp': 'cloud.google.com',
  'digitalocean': 'digitalocean.com', 'heroku': 'heroku.com', 'vercel': 'vercel.com', 'netlify': 'netlify.com',
  'cloudflare': 'cloudflare.com', 'railway': 'railway.app', 'render': 'render.com', 'hetzner': 'hetzner.com',
  'linode': 'linode.com', 'fly': 'fly.io', 'scaleway': 'scaleway.com', 'ovh': 'ovhcloud.com',
  'alibaba': 'alibabacloud.com', 'oracle': 'oracle.com', 'tencent': 'cloud.tencent.com', 'akamai': 'akamai.com',
  'ibm': 'ibm.com', 'supabase': 'supabase.com', 'firebase': 'firebase.google.com', 'apprite': 'appwrite.io',
  
  // Finance, Payments & Web3
  'stripe': 'stripe.com', 'paypal': 'paypal.com', 'lemonsqueezy': 'lemonsqueezy.com', 'paddle': 'paddle.com',
  'adyen': 'adyen.com', 'braintree': 'braintreegateway.com', 'shopify': 'shopify.com', 'plaid': 'plaid.com',
  'revolut': 'revolut.com', 'monzo': 'monzo.com', 'wise': 'wise.com', 'square': 'squareup.com',
  'coinbase': 'coinbase.com', 'binance': 'binance.com', 'kraken': 'kraken.com', 'moonpay': 'moonpay.com',
  'bitpay': 'bitpay.com', 'paystack': 'paystack.com', 'flutterwave': 'flutterwave.com', 'metamask': 'metamask.io',
  
  // Databases & Storage
  'mongodb': 'mongodb.com', 'planetscale': 'planetscale.com', 'redis': 'redis.com', 'upstash': 'upstash.com',
  'postgresql': 'postgresql.org', 'mysql': 'mysql.com', 'fauna': 'fauna.com', 'neon': 'neon.tech',
  'turso': 'turso.tech', 'surreal': 'surrealdb.com', 'cockroach': 'cockroachlabs.com', 'elastic': 'elastic.co',
  'algolia': 'algolia.com', 'meilisearch': 'meilisearch.com', 'pocketbase': 'pocketbase.io', 'tidb': 'pingcap.com',
  'couchdb': 'couchdb.apache.org', 'cassandra': 'cassandra.apache.org', 'rethinkdb': 'rethinkdb.com',
  
  // DevTools, SRE & Productivity
  'github': 'github.com', 'gitlab': 'gitlab.com', 'bitbucket': 'bitbucket.org', 'docker': 'docker.com',
  'sentry': 'sentry.io', 'postman': 'postman.com', 'slack': 'slack.com', 'discord': 'discord.com',
  'figma': 'figma.com', 'notion': 'notion.so', 'linear': 'linear.app', 'trello': 'trello.com',
  'asana': 'asana.com', 'monday': 'monday.com', 'jira': 'atlassian.com', 'confluence': 'atlassian.com',
  'clickup': 'clickup.com', 'todoist': 'todoist.com', 'miro': 'miro.com', 'airtable': 'airtable.com',
  'zapier': 'zapier.com', 'make': 'make.com', 'loom': 'loom.com', 'zoom': 'zoom.us',
  'datadog': 'datadoghq.com', 'newrelic': 'newrelic.com', 'grafana': 'grafana.com', 'prometheus': 'prometheus.io',
  'terraform': 'terraform.io', 'pulumi': 'pulumi.com', 'argocd': 'argoproj.github.io', 'jenkins': 'jenkins.io',
  
  // Marketing, Comms & Email
  'twilio': 'twilio.com', 'sendgrid': 'sendgrid.com', 'resend': 'resend.com', 'mailchimp': 'mailchimp.com',
  'postmark': 'postmarkapp.com', 'intercom': 'intercom.com', 'whatsapp': 'whatsapp.com', 'telegram': 'telegram.org',
  'salesforce': 'salesforce.com', 'hubspot': 'hubspot.com', 'zendesk': 'zendesk.com', 'brevo': 'brevo.com',
  'beehiiv': 'beehiiv.com', 'convertkit': 'convertkit.com', 'mailgun': 'mailgun.com', 'vonage': 'vonage.com'
}

interface GetSecretIconProps {
  name: string
  categoryId: string
  size?: number
}

const ICON_SLUGS: Record<string, string> = {
  'gemini': 'googlegemini',
  'vertex': 'googlecloud',
  'openai': 'openai',
  'anthropic': 'anthropic',
  'meta': 'meta',
  'mistral': 'mistral',
  'claude': 'anthropic'
}

export function SecretIcon({ name, categoryId, size = 20 }: GetSecretIconProps) {
  const normalized = name.toLowerCase().trim().replace(/[\s\-_]/g, '')
  
  // Smart keyword matching
  const matchedKey = Object.keys(BRAND_MAP).find(k => normalized.includes(k))

  const iconContent = (matchedKey) ? (
    <img
      src={`https://www.google.com/s2/favicons?sz=128&domain=${BRAND_MAP[matchedKey]}`}
      style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: 'inherit' }}
      alt={matchedKey}
      onError={(e) => {
        (e.currentTarget as HTMLImageElement).src = `https://cdn.simpleicons.org/${ICON_SLUGS[matchedKey] || matchedKey}`
      }}
    />
  ) : (
    <span style={{ color: 'var(--accent)', transform: 'scale(1.1)', display: 'flex' }}>
      {(CATEGORIES.find(c => c.id === categoryId) || CATEGORIES[CATEGORIES.length - 1]).icon}
    </span>
  )

  return (
    <div style={{
      width: size + 10, height: size + 10,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(255, 255, 255, 0.04)',
      borderRadius: '10px',
      border: '1px solid rgba(255, 255, 255, 0.03)',
      flexShrink: 0,
      overflow: 'hidden',
      padding: matchedKey ? '1px' : '4px'
    }}>
      {iconContent}
    </div>
  )
}
