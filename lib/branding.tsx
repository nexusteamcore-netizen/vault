import React from 'react'
import { 
  Bot, CreditCard, Cloud, GitBranch, Triangle, Phone, Mail, Key, Brain,
  Database, Shield, Zap, Terminal, Code, Layout, MessageSquare, Coffee
} from 'lucide-react'

// ORIGINAL CATEGORIES (Keeping as requested)
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
  // AI & ML
  'openai': 'openai.com', 'anthropic': 'anthropic.com', 'google': 'google.com', 'microsoft': 'microsoft.com',
  'gemini': 'gemini.google.com', 'claude': 'anthropic.com', 'meta': 'meta.com', 'huggingface': 'huggingface.co', 
  'cohere': 'cohere.ai', 'mistral': 'mistral.ai', 'elevenlabs': 'elevenlabs.io', 'pinecone': 'pinecone.io', 
  'langchain': 'langchain.com', 'midjourney': 'midjourney.com', 'groq': 'groq.com', 'grok': 'x.ai', 'xai': 'x.ai',
  'stability': 'stability.ai', 'perplexity': 'perplexity.ai', 'nvidia': 'nvidia.com', 'jasper': 'jasper.ai',
  
  // Cloud & Infrastructure
  'aws': 'amazonaws.com', 'amazon': 'amazon.com', 'azure': 'azure.microsoft.com', 'gcp': 'cloud.google.com',
  'digitalocean': 'digitalocean.com', 'heroku': 'heroku.com', 'vercel': 'vercel.com', 'netlify': 'netlify.com',
  'cloudflare': 'cloudflare.com', 'railway': 'railway.app', 'render': 'render.com', 'hetzner': 'hetzner.com',
  'linode': 'linode.com', 'fly': 'fly.io', 'scaleway': 'scaleway.com', 'ovh': 'ovhcloud.com',
  'supabase': 'supabase.com', 'firebase': 'firebase.google.com',
  
  // Finance & Payments
  'stripe': 'stripe.com', 'paypal': 'paypal.com', 'lemonsqueezy': 'lemonsqueezy.com', 'paddle': 'paddle.com',
  'revolut': 'revolut.com', 'monzo': 'monzo.com', 'wise': 'wise.com', 'square': 'squareup.com',
  
  // DevTools & Comms
  'github': 'github.com', 'gitlab': 'gitlab.com', 'bitbucket': 'bitbucket.org', 'slack': 'slack.com', 
  'discord': 'discord.com', 'figma': 'figma.com', 'notion': 'notion.so', 'twilio': 'twilio.com',
  'sendgrid': 'sendgrid.com', 'resend': 'resend.com', 'mailchimp': 'mailchimp.com', 'telegram': 'telegram.org',
  'whatsapp': 'whatsapp.com'
}

// Special "Secret Signatures" for automatic detection
const SIGNATURE_MAP: Record<string, string> = {
  'sk-': 'openai',
  'pk_': 'stripe',
  'ghp_': 'github',
  'aws_': 'aws',
  'tg-': 'telegram',
  'vtx_': 'vaultix'
}

const ICON_SLUGS: Record<string, string> = {
  'claude': 'anthropic',
  'grok': 'xai',
  'xai': 'xai',
  'nextjs': 'nextdotjs',
}

interface GetSecretIconProps {
  name: string
  categoryId: string
  size?: number
}

export function SecretIcon({ name, categoryId, size = 20 }: GetSecretIconProps) {
  const normalized = name.toLowerCase().trim()
  
  // 1. Check Signatures First
  const signatureMatch = Object.keys(SIGNATURE_MAP).find(sig => normalized.startsWith(sig))
  const brandKey = signatureMatch ? SIGNATURE_MAP[signatureMatch] : Object.keys(BRAND_MAP).find(k => normalized.includes(k))
  
  const domain = brandKey ? BRAND_MAP[brandKey] : (normalized.includes('.') ? normalized : `${normalized}.com`)
  const slug = brandKey ? (ICON_SLUGS[brandKey] || brandKey) : normalized

  const iconContent = (
    <img
      src={`https://www.google.com/s2/favicons?sz=128&domain=${domain}`}
      style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: 'inherit' }}
      alt={name}
      onError={(e) => {
        const target = e.currentTarget as HTMLImageElement;
        if (!target.src.includes('clearbit')) {
          target.src = `https://logo.clearbit.com/${domain}`;
        } else if (!target.src.includes('simpleicons')) {
          target.src = `https://cdn.simpleicons.org/${slug}`;
        } else {
          target.style.display = 'none';
        }
      }}
    />
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
      padding: '2px'
    }}>
      {iconContent}
      <div style={{ position: 'absolute', opacity: 0 }}>
        {/* Fallback hidden icon for accessibility or CSS styling if needed */}
        {(CATEGORIES.find(c => c.id === categoryId) || CATEGORIES[CATEGORIES.length - 1]).icon}
      </div>
    </div>
  )
}
