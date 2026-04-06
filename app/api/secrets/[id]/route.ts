import { requireSession, logAccess } from '@/lib/auth'
import { encrypt, decrypt } from '@/lib/crypto'
import { prisma } from '@/lib/db'
import type { NextRequest } from 'next/server'

type Params = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const session = await requireSession()
    const { id } = await params
    const secret = await prisma.secret.findFirst({ where: { id, userId: session.id } })
    if (!secret) return Response.json({ error: 'Not found' }, { status: 404 })

    const value = decrypt(secret.encryptedValue, secret.iv, secret.tag)
    await prisma.secret.update({ where: { id }, data: { lastAccessed: new Date() } })
    await logAccess({ userId: session.id, secretId: id, action: 'read', request: _req })

    return Response.json({
      secret: {
        id: secret.id,
        name: secret.name,
        service: secret.service,
        description: secret.description,
        value,
        createdAt: secret.createdAt,
        updatedAt: secret.updatedAt,
        lastAccessed: new Date(),
      },
    })
  } catch (err) {
    console.error(err)
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const session = await requireSession()
    const { id } = await params
    const existing = await prisma.secret.findFirst({ where: { id, userId: session.id } })
    if (!existing) return Response.json({ error: 'Not found' }, { status: 404 })

    const { name, value, service, description } = await request.json()
    const encData = value
      ? encrypt(value)
      : { encryptedValue: existing.encryptedValue, iv: existing.iv, tag: existing.tag }

    const updated = await prisma.secret.update({
      where: { id },
      data: {
        name: name ?? existing.name,
        service: service ?? existing.service,
        description: description !== undefined ? description : existing.description,
        ...encData,
      },
      select: { id: true, name: true, service: true, description: true, updatedAt: true },
    })
    await logAccess({ userId: session.id, secretId: id, action: 'update', request })
    return Response.json({ secret: updated })
  } catch (err) {
    console.error(err)
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const session = await requireSession()
    const { id } = await params
    const existing = await prisma.secret.findFirst({ where: { id, userId: session.id } })
    if (!existing) return Response.json({ error: 'Not found' }, { status: 404 })
    await logAccess({ userId: session.id, secretId: id, action: 'delete', request: _req })
    await prisma.secret.delete({ where: { id } })
    return Response.json({ ok: true })
  } catch (err) {
    console.error(err)
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}
