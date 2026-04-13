import { requireApiToken } from '@/lib/auth'
import { encrypt, decrypt } from '@/lib/crypto'
import { prisma } from '@/lib/db'
import { PROXY_PROVIDERS } from '@/lib/proxy-providers'
import { scrubSecrets } from '@/lib/security'

export async function POST(request: Request) {
  let activeSecretValue = ''
  try {
    const user = await requireApiToken(request)
    if (!user) return Response.json({ error: 'Invalid or missing access token' }, { status: 401 })

    const body = await request.json()
    const { tool, params } = body
    const rawIp = request.headers.get('x-forwarded-for') ?? 
                  request.headers.get('x-real-ip') ?? 
                  'unknown'
    const ip = rawIp.split(',')[0].trim()

    if (tool === 'list_secrets') {
      const secrets = await prisma.secret.findMany({
        where: { userId: user.id },
        select: { id: true, name: true, service: true, description: true, lastAccessed: true },
        orderBy: { name: 'asc' },
      })
      await prisma.accessLog.create({
        data: { userId: user.id, action: 'mcp_list', source: 'mcp', ipAddress: ip },
      })
      return Response.json({ result: secrets })
    }


    if (tool === 'set_secret') {
      const { name, value, service, description } = params || {}
      if (!name || !value) return Response.json({ error: 'params.name and params.value required' }, { status: 400 })
      const enc = encrypt(value)
      const secret = await prisma.secret.upsert({
        where: { userId_name: { userId: user.id, name } },
        update: { encryptedValue: enc.encryptedValue, iv: enc.iv, tag: enc.tag, service: service ?? 'custom', description: description ?? null },
        create: { userId: user.id, name, encryptedValue: enc.encryptedValue, iv: enc.iv, tag: enc.tag, service: service ?? 'custom', description: description ?? null },
        select: { id: true, name: true },
      })
      await prisma.accessLog.create({
        data: { userId: user.id, secretId: secret.id, action: 'mcp_write', source: 'mcp', ipAddress: ip },
      })
      return Response.json({ result: { ok: true, name: secret.name } })
    }

    if (tool === 'execute_proxy') {
      const { secretName, provider, endpoint, payload } = params || {}
      if (!secretName || !provider || !endpoint) return Response.json({ error: 'Missing required parameters' }, { status: 400 })

      const providerConfig = PROXY_PROVIDERS[provider]
      if (!providerConfig) return Response.json({ error: 'Unsupported proxy provider' }, { status: 400 })

      const endpointConfig = providerConfig[endpoint]
      if (!endpointConfig) return Response.json({ error: 'Unsupported provider endpoint' }, { status: 400 })

      const secret = await prisma.secret.findFirst({ where: { userId: user.id, name: secretName } })
      if (!secret) return Response.json({ error: 'Secret not found' }, { status: 404 })

      activeSecretValue = decrypt(secret.encryptedValue, secret.iv, secret.tag)

      await prisma.accessLog.create({
        data: { userId: user.id, secretId: secret.id, action: `mcp_proxy_${provider}_${endpoint}`, source: 'mcp', ipAddress: ip },
      })

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...endpointConfig.injectSecret(activeSecretValue)
      }

      const fetchOptions: RequestInit = { method: endpointConfig.method, headers }
      if (endpointConfig.method !== 'GET' && payload) {
        fetchOptions.body = JSON.stringify(payload)
      }

      const response = await fetch(endpointConfig.url, fetchOptions)
      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        // SCRUB: Prevent leakage in external error responses for AI Agents
        const safeError = scrubSecrets(data, [activeSecretValue]);
        return Response.json({ error: 'External API Error', details: safeError }, { status: response.status })
      }

      // SCRUB: Success data sanitization
      const safeData = scrubSecrets(data, [activeSecretValue]);
      return Response.json({ result: { data: safeData } })
    }

    return Response.json({
      error: `Unknown tool "${tool}". Available: list_secrets, set_secret, execute_proxy`,
    }, { status: 400 })
  } catch (err: any) {
    console.error(err)
    // SCRUB: Global error sanitizer
    const safeError = scrubSecrets(err.message || 'Server error', [activeSecretValue]);
    return Response.json({ error: safeError }, { status: 500 })
  }
}

export async function GET() {
  return Response.json({
    name: 'phantomapi-mcp',
    version: '1.0.0',
    description: 'PhantomAPI MCP server — manage API keys from your AI agent',
    tools: [
      { 
        name: 'list_secrets', 
        description: 'List all secret names and metadata', 
        inputSchema: {
          type: "object",
          properties: {}
        }
      },
      { 
        name: 'execute_proxy', 
        description: 'Execute a secure request to an external provider using a vaulted secret. The secret never leaves the vault.', 
        inputSchema: {
          type: "object",
          properties: {
            secretName: { type: "string", description: "Name of the secret to use" },
            provider: { type: "string", description: "Provider name (e.g., openai, stripe, github)" },
            endpoint: { type: "string", description: "Endpoint name (e.g., chat.completions, customers.list, repos.list)" },
            payload: { type: "object", description: "Optional JSON payload for POST/PUT requests" }
          },
          required: ["secretName", "provider", "endpoint"]
        }
      },
      { 
        name: 'set_secret', 
        description: 'Create or update a secret', 
        inputSchema: {
          type: "object",
          properties: {
            name: { type: "string", description: "The unique name for the secret" },
            value: { type: "string", description: "The secret value to encrypt and store" },
            service: { type: "string", description: "Optional service name (e.g., stripe, openai)" },
            description: { type: "string", description: "Optional description of the secret" }
          },
          required: ["name", "value"]
        }
      },
    ],
  })
}
