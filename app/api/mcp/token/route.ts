import { requireSession, logAccess } from '@/lib/auth'
import { prisma } from '@/lib/db'
import crypto from 'crypto'

export async function GET() {
  try {
    const session = await requireSession()
    const tokens = await prisma.mcpToken.findMany({
      where: { userId: session.id },
      select: { id: true, name: true, token: true, lastUsed: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    })
    return Response.json({ tokens })
  } catch {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireSession()
    const { name } = await request.json()
    if (!name) return Response.json({ error: 'Token name required' }, { status: 400 })

    const host = request.headers.get('host') || 'localhost:3000'
    const protocol = request.headers.get('x-forwarded-proto') || 'http'
    const baseUrlEncoded = Buffer.from(`${protocol}://${host}`).toString('base64').replace(/=/g, '')
    
    const randomHash = crypto.randomBytes(24).toString('hex')
    const token = `vtx_${baseUrlEncoded}_${randomHash}`

    const created = await prisma.mcpToken.create({
      data: { userId: session.id, name, token },
      select: { id: true, name: true, token: true, createdAt: true },
    })
    
    await logAccess({ 
      userId: session.id, 
      action: 'create_token', 
      source: 'web', 
      request 
    })

    return Response.json({ token: created }, { status: 201 })
  } catch (err) {
    console.error(err)
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await requireSession()
    const { id } = await request.json()
    const tok = await prisma.mcpToken.findFirst({ where: { id, userId: session.id } })
    if (!tok) return Response.json({ error: 'Not found' }, { status: 404 })
    await prisma.mcpToken.delete({ where: { id } })

    await logAccess({ 
      userId: session.id, 
      action: 'delete_token', 
      source: 'web', 
      request 
    })

    return Response.json({ ok: true })
  } catch (err) {
    console.error(err)
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}
