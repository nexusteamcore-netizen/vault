import { requireSession, logAccess } from '@/lib/auth'
import { encrypt } from '@/lib/crypto'
import { prisma } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const session = await requireSession()
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''

    const secrets = await prisma.secret.findMany({
      where: {
        userId: session.id,
        ...(search ? { name: { contains: search } } : {}),
      },
      select: {
        id: true,
        name: true,
        service: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        lastAccessed: true,
      },
      orderBy: { updatedAt: 'desc' },
    })
    return Response.json({ secrets })
  } catch {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireSession()
    const { name, value, service, description } = await request.json()
    if (!name || !value) return Response.json({ error: 'Name and value are required' }, { status: 400 })

    const { encryptedValue, iv, tag } = encrypt(value)
    const secret = await prisma.secret.create({
      data: {
        userId: session.id,
        name,
        service: service || 'custom',
        description: description || null,
        encryptedValue,
        iv,
        tag,
      },
      select: { id: true, name: true, service: true, description: true, createdAt: true },
    })
    await logAccess({ userId: session.id, secretId: secret.id, action: 'create', request })
    return Response.json({ secret }, { status: 201 })
  } catch (err: any) {
    if (err?.code === 'P2002') return Response.json({ error: 'A secret with this name already exists' }, { status: 409 })
    return Response.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}
