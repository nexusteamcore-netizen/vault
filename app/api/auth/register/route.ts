import { prisma } from '@/lib/db'
import { signToken, setSessionCookie } from '@/lib/auth'
import * as bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, password } = body
    
    if (!email || !password) {
      return Response.json({ error: 'Email and password required' }, { status: 400 })
    }
    
    // Test DB connection BEFORE anything else
    try {
      await prisma.$connect()
    } catch (dbErr: any) {
      return Response.json({ error: `Database connection failed: ${dbErr.message}` }, { status: 500 })
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return Response.json({ error: 'An account with this email already exists' }, { status: 409 })
    }

    let passwordHash
    try {
      passwordHash = await bcrypt.hash(password, 10)
    } catch (hashErr: any) {
      return Response.json({ error: `Hashing failed: ${hashErr.message}` }, { status: 500 })
    }
    
    const user = await prisma.user.create({ 
      data: { 
        email, 
        name: name || null, 
        passwordHash 
      } 
    })

    const token = signToken({ id: user.id, email: user.email, name: user.name })
    const { name: cookieName, value, options } = setSessionCookie(token)
    
    const cookieStore = await cookies()
    cookieStore.set(cookieName, value, options as any)

    return Response.json({ user: { id: user.id, email: user.email, name: user.name } }, { status: 201 })
  } catch (err: any) {
    // If we reach here, it might be a JSON parse error or something else
    return Response.json({ error: err.message || 'Fatal server error' }, { status: 500 })
  }
}
