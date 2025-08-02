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

  // Create sample outfits with items for users
  const outfits = await Promise.all([
    // Alice's outfits
    prisma.outfit.create({
      data: {
        name: 'Summer Casual',
        description: 'Light cotton dress with sandals and a wide-brim hat',
        tags: ['casual', 'summer', 'dress'],
        isPrivate: false,
        userId: userIdMapping.alice,
        items: {
          create: [
            {
              name: 'Cotton Summer Dress',
              category: 'UPPERWEAR',
              description: 'Light blue cotton dress',
            },
            {
              name: 'Straw Hat',
              category: 'HEADWEAR',
              description: 'Wide-brim straw hat',
            },
            {
              name: 'Leather Sandals',
              category: 'FOOTWEAR',
              description: 'Brown leather sandals',
            },
          ],
        },
      },
    }),
    prisma.outfit.create({
      data: {
        name: 'Business Meeting',
        description: 'Navy blazer, white blouse, and tailored pants',
        tags: ['formal', 'business', 'professional'],
        isPrivate: true,
        userId: userIdMapping.alice,
        items: {
          create: [
            {
              name: 'Navy Blazer',
              category: 'UPPERWEAR',
              description: 'Professional navy blazer',
            },
            {
              name: 'White Blouse',
              category: 'UPPERWEAR',
              description: 'Crisp white blouse',
            },
            {
              name: 'Tailored Pants',
              category: 'LOWERWEAR',
              description: 'Black tailored pants',
            },
          ],
        },
      },
    }),

    // Bob's outfits
    prisma.outfit.create({
      data: {
        name: 'Weekend Brunch',
        description: 'Flowy top, high-waisted jeans, and ankle boots',
        tags: ['casual', 'weekend', 'brunch'],
        isPrivate: false,
        userId: userIdMapping.bob,
        items: {
          create: [
            {
              name: 'Flowy Top',
              category: 'UPPERWEAR',
              description: 'Light colored flowy top',
            },
            {
              name: 'High-Waisted Jeans',
              category: 'LOWERWEAR',
              description: 'Blue high-waisted jeans',
            },
            {
              name: 'Ankle Boots',
              category: 'FOOTWEAR',
              description: 'Brown ankle boots',
            },
          ],
        },
      },
    }),
    prisma.outfit.create({
      data: {
        name: 'Date Night',
        description: 'Little black dress with statement jewelry',
        tags: ['formal', 'date', 'evening'],
        isPrivate: false,
        userId: userIdMapping.bob,
        items: {
          create: [
            {
              name: 'Little Black Dress',
              category: 'UPPERWEAR',
              description: 'Classic little black dress',
            },
            {
              name: 'Statement Necklace',
              category: 'ACCESSORIES',
              description: 'Gold statement necklace',
            },
          ],
        },
      },
    }),

    // Diana's outfits
    prisma.outfit.create({
      data: {
        name: 'Gym Session',
        description: 'Athletic wear with supportive sneakers',
        tags: ['athletic', 'gym', 'workout'],
        isPrivate: false,
        userId: userIdMapping.diana,
        items: {
          create: [
            {
              name: 'Athletic Top',
              category: 'UPPERWEAR',
              description: 'Moisture-wicking athletic top',
            },
            {
              name: 'Athletic Shorts',
              category: 'LOWERWEAR',
              description: 'Comfortable athletic shorts',
            },
            {
              name: 'Running Shoes',
              category: 'FOOTWEAR',
              description: 'Supportive running shoes',
            },
          ],
        },
      },
    }),
    prisma.outfit.create({
      data: {
        name: 'Coffee Run',
        description: 'Comfortable sweater, leggings, and sneakers',
        tags: ['casual', 'comfortable', 'errands'],
        isPrivate: false,
        userId: userIdMapping.diana,
        items: {
          create: [
            {
              name: 'Cozy Sweater',
              category: 'UPPERWEAR',
              description: 'Warm and comfortable sweater',
            },
            {
              name: 'Leggings',
              category: 'LOWERWEAR',
              description: 'Comfortable leggings',
            },
            {
              name: 'Sneakers',
              category: 'FOOTWEAR',
              description: 'Casual sneakers',
            },
          ],
        },
      },
    }),

    // Edward's outfits
    prisma.outfit.create({
      data: {
        name: 'Hiking Adventure',
        description: 'Moisture-wicking clothes and hiking boots',
        tags: ['outdoor', 'hiking', 'adventure'],
        isPrivate: false,
        userId: userIdMapping.edward,
        items: {
          create: [
            {
              name: 'Moisture-Wicking Shirt',
              category: 'UPPERWEAR',
              description: 'Quick-dry hiking shirt',
            },
            {
              name: 'Hiking Pants',
              category: 'LOWERWEAR',
              description: 'Durable hiking pants',
            },
            {
              name: 'Hiking Boots',
              category: 'FOOTWEAR',
              description: 'Waterproof hiking boots',
            },
          ],
        },
      },
    }),
    prisma.outfit.create({
      data: {
        name: 'Home Office',
        description: 'Comfortable but presentable for video calls',
        tags: ['work', 'home', 'comfortable'],
        isPrivate: true,
        userId: userIdMapping.edward,
        items: {
          create: [
            {
              name: 'Polo Shirt',
              category: 'UPPERWEAR',
              description: 'Professional polo shirt',
            },
            {
              name: 'Chino Pants',
              category: 'LOWERWEAR',
              description: 'Comfortable chino pants',
            },
          ],
        },
      },
    }),
  ]);

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
