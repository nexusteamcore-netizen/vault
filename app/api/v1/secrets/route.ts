import { requireApiToken } from '@/lib/auth'
import { prisma } from '@/lib/db'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const user = await requireApiToken(request)
    if (!user) return Response.json({ error: 'Invalid or missing API key' }, { status: 401 })

    const secrets = await prisma.secret.findMany({
      where: { userId: user.id },
      select: { name: true, service: true, description: true, createdAt: true, updatedAt: true, lastAccessed: true },
      orderBy: { name: 'asc' },
    })

    const ip = request.headers.get('x-forwarded-for') ?? 'unknown'
    await prisma.accessLog.create({
      data: { userId: user.id, action: 'api_list', source: 'api', ipAddress: ip },
    })

    return Response.json({ secrets })
  } catch (err: any) {
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}
