import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const globalForPrisma = globalThis as unknown as { 
  prisma?: PrismaClient,
}

export function getPrisma() {
  if (globalForPrisma.prisma) return globalForPrisma.prisma

  try {
    const connectionString = process.env.DATABASE_URL
    if (!connectionString) {
      console.warn('[DB] DATABASE_URL missing, falling back to standard client')
      return new PrismaClient()
    }

    const pool = new Pool({ 
      connectionString,
      ssl: { rejectUnauthorized: false }
    })

    const adapter = new PrismaPg(pool)
    const client = new PrismaClient({ adapter })
    
    globalForPrisma.prisma = client
    return client
  } catch (err) {
    console.error('[DB] Initialization error:', err)
    return new PrismaClient()
  }
}

// Keep the export but make it a getter or just use the function in routes
export const prisma = getPrisma()
