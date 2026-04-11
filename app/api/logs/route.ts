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
  } catch (err: any) {
    if (err.message === 'Unauthorized') {
       return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('[Logs API Error]:', err.message)
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}
export async function POST(request: Request) {
  try {
    const session = await requireSession()
    const { action, secretId, source = 'web' } = await request.json()
    
    // IP extraction for audit
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1'
    const ua = request.headers.get('user-agent') || 'unknown'

    const log = await prisma.accessLog.create({
      data: {
        userId: session.id,
        action,
        secretId,
        source,
        ipAddress: ip,
        userAgent: ua
      }
    })
    
    return Response.json({ success: true, log })
  } catch (err: any) {
    if (err.message === 'Unauthorized') return Response.json({ error: 'Unauthorized' }, { status: 401 })
    console.error('[Logs POST Error]:', err.message)
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}
