import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create 5 users with hashed passwords
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'alice@example.com',
        name: 'Alice',
        password: await bcrypt.hash('password123', 10),
      },
    }),
    prisma.user.create({
      data: {
        email: 'bob@example.com',
        name: 'Bob',
        password: await bcrypt.hash('password123', 10),
      },
    }),
    prisma.user.create({
      data: {
        email: 'charlie@example.com',
        name: 'Charlie',
        password: await bcrypt.hash('password123', 10),
      },
    }),
    prisma.user.create({
      data: {
        email: 'diana@example.com',
        name: 'Diana',
        password: await bcrypt.hash('password123', 10),
      },
    }),
    prisma.user.create({
      data: {
        email: 'edward@example.com',
        name: 'Edward',
        password: await bcrypt.hash('password123', 10),
      },
    }),
  ]);

  const userIdMapping = {
    alice: users[0].id,
    bob: users[1].id,
    charlie: users[2].id,
    diana: users[3].id,
    edward: users[4].id,
  };

  // Create sample outfits for users
  await prisma.outfit.createMany({
    data: [
      // Alice's outfits
      {
        name: 'Summer Casual',
        description: 'Light cotton dress with sandals and a wide-brim hat',
        tags: ['casual', 'summer', 'dress'],
        userId: userIdMapping.alice
      },
      {
        name: 'Business Meeting',
        description: 'Navy blazer, white blouse, and tailored pants',
        tags: ['formal', 'business', 'professional'],
        userId: userIdMapping.alice
      },

      // Bob's outfits
      {
        name: 'Weekend Brunch',
        description: 'Flowy top, high-waisted jeans, and ankle boots',
        tags: ['casual', 'weekend', 'brunch'],
        userId: userIdMapping.bob
      },
      {
        name: 'Date Night',
        description: 'Little black dress with statement jewelry',
        tags: ['formal', 'date', 'evening'],
        userId: userIdMapping.bob
      },

      // Diana's outfits
      {
        name: 'Gym Session',
        description: 'Athletic wear with supportive sneakers',
        tags: ['athletic', 'gym', 'workout'],
        userId: userIdMapping.diana
      },
      {
        name: 'Coffee Run',
        description: 'Comfortable sweater, leggings, and sneakers',
        tags: ['casual', 'comfortable', 'errands'],
        userId: userIdMapping.diana
      },

      // Edward's outfits
      {
        name: 'Hiking Adventure',
        description: 'Moisture-wicking clothes and hiking boots',
        tags: ['outdoor', 'hiking', 'adventure'],
        userId: userIdMapping.edward
      },
      {
        name: 'Home Office',
        description: 'Comfortable but presentable for video calls',
        tags: ['work', 'home', 'comfortable'],
        userId: userIdMapping.edward
      },
    ],
  });

  console.log('Seeding completed.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
