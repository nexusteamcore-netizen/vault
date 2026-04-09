import { requireApiToken } from '@/lib/auth'
import { decrypt } from '@/lib/crypto'
import { prisma } from '@/lib/db'
import type { NextRequest } from 'next/server'
import { PROXY_PROVIDERS } from '@/lib/proxy-providers'
import { scrubSecrets } from '@/lib/security'

export async function POST(request: NextRequest) {
  let plainSecret = '';
  try {
    const user = await requireApiToken(request)
    if (!user) return Response.json({ error: 'Invalid or missing API key' }, { status: 401 })

    const body = await request.json()
    const { secretName, provider, endpoint, payload } = body

    if (!secretName || !provider || !endpoint) {
      return Response.json({ error: 'Missing required parameters: secretName, provider, endpoint' }, { status: 400 })
    }

    // Secure Validation: Ensure provider and endpoint are strictly listed
    const providerConfig = PROXY_PROVIDERS[provider]
    if (!providerConfig) {
      return Response.json({ error: 'Unsupported proxy provider' }, { status: 400 })
    }

    const endpointConfig = providerConfig[endpoint]
    if (!endpointConfig) {
      return Response.json({ error: 'Unsupported provider endpoint' }, { status: 400 })
    }

    // Fetch the secret
    const secret = await prisma.secret.findFirst({
      where: { userId: user.id, name: secretName }
    })

    if (!secret) return Response.json({ error: 'Secret not found' }, { status: 404 })

    plainSecret = decrypt(secret.encryptedValue, secret.iv, secret.tag)

    // Audit Log: Record proxy usage without revealing actual payload/secret
    const ip = request.headers.get('x-forwarded-for') ?? 'unknown'
    await prisma.accessLog.create({
      data: { userId: user.id, secretId: secret.id, action: `proxy_${provider}_${endpoint}`, source: 'api_proxy', ipAddress: ip },
    })

    // Construct External Request
    const headers = {
      'Content-Type': 'application/json',
      ...endpointConfig.injectSecret(plainSecret)
    }

    const fetchOptions: RequestInit = {
      method: endpointConfig.method,
      headers
    }

    // Only add body if not GET
    if (endpointConfig.method !== 'GET' && payload) {
      fetchOptions.body = JSON.stringify(payload)
    }

    const response = await fetch(endpointConfig.url, fetchOptions)
    
    // Parse response
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      // SCRUB: Extremely important to scrub error details as some APIs echo back headers on failure
      const safeErrorDetails = scrubSecrets(data, [plainSecret]);
      return Response.json({ error: 'External API Error', details: safeErrorDetails }, { status: response.status })
    }

    // SCRUB: Even success responses should be scrubbed just in case
    const safeData = scrubSecrets(data, [plainSecret]);
    return Response.json({ data: safeData })

  } catch (err: any) {
    // SCRUB: Catch-all error scrubbing
    const safeErrorMessage = scrubSecrets(err.message || 'Server error', [plainSecret]);
    return Response.json({ error: safeErrorMessage }, { status: 500 })
  }
}
