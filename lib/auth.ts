import { cookies } from 'next/headers'
import { prisma } from './db'
import { signToken, verifyToken, setSessionCookie, COOKIE_NAME, SessionUser } from './jwt'

export { signToken, verifyToken, setSessionCookie, COOKIE_NAME }
export type { SessionUser }

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return null
  return verifyToken(token)
}

export async function requireSession(): Promise<SessionUser> {
  const session = await getSession()
  if (!session) throw new Error('Unauthorized')
  return session
}

export async function requireApiToken(request: Request) {
  const auth = request.headers.get('authorization')
  if (!auth?.startsWith('Bearer ')) return null
  const token = auth.slice(7)
  const mcpToken = await prisma.mcpToken.findUnique({ where: { token }, include: { user: true } })
  if (!mcpToken) return null
  await prisma.mcpToken.update({ where: { token }, data: { lastUsed: new Date() } })
  return mcpToken.user
}

export async function logAccess(params: {
  userId: string
  secretId?: string
  action: string
  request?: Request
  source?: string
}) {
  try {
    const ip = params.request?.headers.get('x-forwarded-for') ?? 'unknown'
    const ua = params.request?.headers.get('user-agent') ?? 'unknown'
    await prisma.accessLog.create({
      data: {
        userId: params.userId,
        secretId: params.secretId,
        action: params.action,
        ipAddress: ip,
        userAgent: ua,
        source: params.source ?? 'web',
      },
    })
  } catch {
    // non-critical
  }
}
