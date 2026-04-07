import { requireApiToken } from '@/lib/auth'
import { encrypt, decrypt } from '@/lib/crypto'
import { prisma } from '@/lib/db'
import type { NextRequest } from 'next/server'

type Params = { params: Promise<{ name: string }> }

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const user = await requireApiToken(request)
    if (!user) return Response.json({ error: 'Invalid or missing API key' }, { status: 401 })

    const { name } = await params

    const secret = await prisma.secret.findFirst({
      where: { userId: user.id, name },
    })

    if (!secret) return Response.json({ error: 'Secret not found' }, { status: 404 })

    const value = decrypt(secret.encryptedValue, secret.iv, secret.tag)

    await prisma.secret.update({ where: { id: secret.id }, data: { lastAccessed: new Date() } })
    const ip = request.headers.get('x-forwarded-for') ?? 'unknown'
    await prisma.accessLog.create({
      data: { userId: user.id, secretId: secret.id, action: 'api_read', source: 'api', ipAddress: ip },
    })

    return Response.json({ name: secret.name, value, service: secret.service })
  } catch (err: any) {
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}
