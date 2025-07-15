
import { PrismaClient } from '@prisma/client';
import { MARKET_CATEGORIES } from '../lib/categories';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');

  // Clear existing data
  await prisma.chatSession.deleteMany({});
  await prisma.category.deleteMany({});

  // Seed categories
  console.log('Seeding categories...');
  for (const category of MARKET_CATEGORIES) {
    await prisma.category.create({
      data: {
        id: category.id,
        name: category.name,
        description: category.description,
      },
    });
    console.log(`Created category: ${category.name}`);
  }

  console.log('Database seeding completed!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('Error during seeding:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
