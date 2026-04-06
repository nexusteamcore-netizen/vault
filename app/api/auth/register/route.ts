import { prisma } from '@/lib/db'
import { signToken, setSessionCookie } from '@/lib/auth'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()
    if (!email || !password) return Response.json({ error: 'Email and password required' }, { status: 400 })
    if (password.length < 8) return Response.json({ error: 'Password must be at least 8 characters' }, { status: 400 })

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) return Response.json({ error: 'An account with this email already exists' }, { status: 409 })

    const passwordHash = await bcrypt.hash(password, 12)
    const user = await prisma.user.create({ data: { email, name: name || null, passwordHash } })

    const token = signToken({ id: user.id, email: user.email, name: user.name })
    const { name: cookieName, value, options } = setSessionCookie(token)
    const cookieStore = await cookies()
    cookieStore.set(cookieName, value, options as any)

    return Response.json({ user: { id: user.id, email: user.email, name: user.name } }, { status: 201 })
  } catch (err) {
    return Response.json({ error: (err as any).message || 'Server error' }, { status: 500 })
  }
}
