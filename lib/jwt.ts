// Pure JWT + cookie helpers — NO database imports
// Safe to use in middleware (Edge runtime)
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET!
export const COOKIE_NAME = 'phantomapi_session'

export interface SessionUser {
  id: string
  email: string
  name: string | null
}

export function signToken(user: SessionUser): string {
  return jwt.sign(user, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): SessionUser | null {
  try {
    return jwt.verify(token, JWT_SECRET) as SessionUser
  } catch {
    return null
  }
}

export function setSessionCookie(token: string): { name: string; value: string; options: object } {
  return {
    name: COOKIE_NAME,
    value: token,
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    },
  }
}
