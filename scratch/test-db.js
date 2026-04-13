const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function test() {
  try {
    console.log('Testing DB connection...')
    const userCount = await prisma.user.count()
    console.log('User count:', userCount)
  } catch (err) {
    console.error('DB Connection Failed:', err.message)
  } finally {
    await prisma.$disconnect()
  }
}

test()
