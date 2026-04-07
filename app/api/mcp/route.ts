import { prisma } from '@/lib/db'
import { decrypt, encrypt } from '@/lib/crypto'
import { requireApiToken } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const user = await requireApiToken(request)
    if (!user) return Response.json({ error: 'Invalid or missing access token' }, { status: 401 })

    const body = await request.json()
    const { tool, params } = body
    const ip = request.headers.get('x-forwarded-for') ?? 'unknown'

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

    if (tool === 'get_secret') {
      const { name } = params || {}
      if (!name) return Response.json({ error: 'params.name is required' }, { status: 400 })
      const secret = await prisma.secret.findFirst({ where: { userId: user.id, name } })
      if (!secret) return Response.json({ error: `Secret "${name}" not found` }, { status: 404 })
      const value = decrypt(secret.encryptedValue, secret.iv, secret.tag)
      await prisma.secret.update({ where: { id: secret.id }, data: { lastAccessed: new Date() } })
      await prisma.accessLog.create({
        data: { userId: user.id, secretId: secret.id, action: 'mcp_read', source: 'mcp', ipAddress: ip },
      })
      return Response.json({ result: { name: secret.name, value, service: secret.service } })
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

    return Response.json({
      error: `Unknown tool "${tool}". Available: list_secrets, get_secret, set_secret`,
    }, { status: 400 })
  } catch (err) {
    console.error(err)
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function GET() {
  return Response.json({
    name: 'vaultix-mcp',
    version: '1.0.0',
    description: 'Vaultix MCP server — manage API keys from your AI agent',
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
        name: 'get_secret', 
        description: 'Get a decrypted secret by name', 
        inputSchema: {
          type: "object",
          properties: {
            name: { type: "string", description: "The name of the secret to retrieve" }
          },
          required: ["name"]
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
