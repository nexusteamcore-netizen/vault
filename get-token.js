const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const token = await prisma.mCPToken.findFirst();
  console.log(token ? token.token : 'No token found');
  await prisma.$disconnect();
}

main();
