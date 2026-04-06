import { requireSession } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const session = await requireSession()
    const { searchParams } = new URL(request.url)
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100)

    const logs = await prisma.accessLog.findMany({
      where: { userId: session.id },
      include: { secret: { select: { name: true, service: true } } },
      orderBy: { createdAt: 'desc' },
      take: limit,
    })
    return Response.json({ logs })
  } catch {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
}
