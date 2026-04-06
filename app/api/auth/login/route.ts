import { prisma } from '@/lib/db'
import { signToken, setSessionCookie } from '@/lib/auth'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    if (!email || !password) return Response.json({ error: 'Email and password required' }, { status: 400 })

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return Response.json({ error: 'Invalid email or password' }, { status: 401 })

    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) return Response.json({ error: 'Invalid email or password' }, { status: 401 })

    const token = signToken({ id: user.id, email: user.email, name: user.name })
    const { name: cookieName, value, options } = setSessionCookie(token)
    const cookieStore = await cookies()
    cookieStore.set(cookieName, value, options as any)

    return Response.json({ user: { id: user.id, email: user.email, name: user.name } })
  } catch (err: any) {
    return Response.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}
