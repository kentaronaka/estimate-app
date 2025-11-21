import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Seed data for rates
  const rates = [
    {
      type: '技術者',
      rate: 5000,
    },
    {
      type: '機械',
      rate: 3000,
    },
    {
      type: '警備',
      rate: 2000,
    },
  ];

  for (const rate of rates) {
    await prisma.rate.create({
      data: rate,
    });
  }

  console.log('Database seeded with initial rates.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });