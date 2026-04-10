import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

const globalForPrisma = globalThis as unknown as { 
  prisma?: PrismaClient,
  pool?: Pool,
  adapter?: PrismaPg
}

function getPrismaClient() {
  if (!globalForPrisma.prisma) {
    const pool = new Pool({ 
      connectionString: process.env.DATABASE_URL,
      max: process.env.NODE_ENV === 'production' ? 2 : 10,
      idleTimeoutMillis: 10000,
      connectionTimeoutMillis: 10000,
      ssl: {
        rejectUnauthorized: false
      }
    })
    const adapter = new PrismaPg(pool)
    globalForPrisma.pool = pool
    globalForPrisma.adapter = adapter
    globalForPrisma.prisma = new PrismaClient({ adapter })
  }
  return globalForPrisma.prisma
}

export const prisma = getPrismaClient()
