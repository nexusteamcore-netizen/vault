import type { Metadata } from 'next'
import { Inter, JetBrains_Mono, Outfit } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' })
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' })

export const metadata: Metadata = {
  title: { default: 'PhantomAPI — Secure API Key Vault', template: '%s | PhantomAPI' },
  description: 'The most secure way to store, manage, and share API keys. 1Password for developers.',
  keywords: ['API keys', 'secrets manager', 'developer tools', 'vault', 'security'],
  openGraph: {
    title: 'PhantomAPI — Secure API Key Vault',
    description: 'Store, manage, and serve API keys with military-grade encryption.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable} ${outfit.variable}`}>
       <body>{children}</body>
    </html>
  )
}
