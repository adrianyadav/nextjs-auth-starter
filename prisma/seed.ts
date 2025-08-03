import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create or find test users with hashed passwords
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'test@example.com' },
      update: {},
      create: {
        email: 'test@example.com',
        name: 'Test User',
        password: await bcrypt.hash('password123', 10),
      },
    }),
    prisma.user.upsert({
      where: { email: 'alice@example.com' },
      update: {},
      create: {
        email: 'alice@example.com',
        name: 'Alice Johnson',
        password: await bcrypt.hash('password123', 10),
      },
    }),
    prisma.user.upsert({
      where: { email: 'bob@example.com' },
      update: {},
      create: {
        email: 'bob@example.com',
        name: 'Bob Smith',
        password: await bcrypt.hash('password123', 10),
      },
    }),
    prisma.user.upsert({
      where: { email: 'charlie@example.com' },
      update: {},
      create: {
        email: 'charlie@example.com',
        name: 'Charlie Brown',
        password: await bcrypt.hash('password123', 10),
      },
    }),
    prisma.user.upsert({
      where: { email: 'diana@example.com' },
      update: {},
      create: {
        email: 'diana@example.com',
        name: 'Diana Prince',
        password: await bcrypt.hash('password123', 10),
      },
    }),
  ]);

  const userIdMapping = {
    test: users[0].id,
    alice: users[1].id,
    bob: users[2].id,
    charlie: users[3].id,
    diana: users[4].id,
  };

  // Clean up existing outfits to avoid duplicates
  await prisma.outfitItem.deleteMany();
  await prisma.outfit.deleteMany();

  // Sample outfits with real Unsplash images
  const outfits = await Promise.all([
    // Alice's outfits
    prisma.outfit.create({
      data: {
        name: 'Summer Beach Day',
        description: 'Perfect for a day at the beach with friends. Light and breezy outfit that keeps you cool and stylish.',
        imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=400&fit=crop',
        tags: ['casual', 'summer', 'beach', 'vacation'],
        isPrivate: false,
        userId: userIdMapping.alice,
        items: {
          create: [
            {
              name: 'White Linen Dress',
              category: 'UPPERWEAR',
              description: 'Light and breathable linen dress',
              purchaseUrl: 'https://example.com/linen-dress',
            },
            {
              name: 'Straw Hat',
              category: 'HEADWEAR',
              description: 'Wide-brim straw hat for sun protection',
              purchaseUrl: 'https://example.com/straw-hat',
            },
            {
              name: 'Leather Sandals',
              category: 'FOOTWEAR',
              description: 'Comfortable leather sandals',
              purchaseUrl: 'https://example.com/leather-sandals',
            },
            {
              name: 'Tote Bag',
              category: 'ACCESSORIES',
              description: 'Large tote bag for beach essentials',
            },
          ],
        },
      },
    }),
    prisma.outfit.create({
      data: {
        name: 'Business Professional',
        description: 'Classic business attire for important meetings and presentations. Professional yet comfortable.',
        imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop',
        tags: ['formal', 'business', 'professional', 'office'],
        isPrivate: true,
        userId: userIdMapping.alice,
        items: {
          create: [
            {
              name: 'Navy Blazer',
              category: 'UPPERWEAR',
              description: 'Professional navy blazer',
              purchaseUrl: 'https://example.com/navy-blazer',
            },
            {
              name: 'White Blouse',
              category: 'UPPERWEAR',
              description: 'Crisp white blouse',
              purchaseUrl: 'https://example.com/white-blouse',
            },
            {
              name: 'Tailored Pants',
              category: 'LOWERWEAR',
              description: 'Black tailored pants',
              purchaseUrl: 'https://example.com/tailored-pants',
            },
            {
              name: 'Pumps',
              category: 'FOOTWEAR',
              description: 'Black leather pumps',
              purchaseUrl: 'https://example.com/pumps',
            },
          ],
        },
      },
    }),

    // Bob's outfits
    prisma.outfit.create({
      data: {
        name: 'Weekend Brunch',
        description: 'Comfortable and stylish outfit perfect for weekend brunches with friends.',
        imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop',
        tags: ['casual', 'weekend', 'brunch', 'comfortable'],
        isPrivate: false,
        userId: userIdMapping.bob,
        items: {
          create: [
            {
              name: 'Flowy Blouse',
              category: 'UPPERWEAR',
              description: 'Light colored flowy blouse',
              purchaseUrl: 'https://example.com/flowy-blouse',
            },
            {
              name: 'High-Waisted Jeans',
              category: 'LOWERWEAR',
              description: 'Blue high-waisted jeans',
              purchaseUrl: 'https://example.com/high-waisted-jeans',
            },
            {
              name: 'Ankle Boots',
              category: 'FOOTWEAR',
              description: 'Brown ankle boots',
              purchaseUrl: 'https://example.com/ankle-boots',
            },
            {
              name: 'Crossbody Bag',
              category: 'ACCESSORIES',
              description: 'Small crossbody bag',
            },
          ],
        },
      },
    }),
    prisma.outfit.create({
      data: {
        name: 'Date Night Elegance',
        description: 'Sophisticated outfit for romantic evenings and special occasions.',
        imageUrl: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop',
        tags: ['formal', 'date', 'evening', 'elegant'],
        isPrivate: false,
        userId: userIdMapping.bob,
        items: {
          create: [
            {
              name: 'Little Black Dress',
              category: 'UPPERWEAR',
              description: 'Classic little black dress',
              purchaseUrl: 'https://example.com/little-black-dress',
            },
            {
              name: 'Statement Necklace',
              category: 'ACCESSORIES',
              description: 'Gold statement necklace',
              purchaseUrl: 'https://example.com/statement-necklace',
            },
            {
              name: 'Heeled Sandals',
              category: 'FOOTWEAR',
              description: 'Elegant heeled sandals',
              purchaseUrl: 'https://example.com/heeled-sandals',
            },
            {
              name: 'Clutch Bag',
              category: 'ACCESSORIES',
              description: 'Small elegant clutch',
            },
          ],
        },
      },
    }),

    // Charlie's outfits
    prisma.outfit.create({
      data: {
        name: 'Athletic Performance',
        description: 'High-performance athletic wear for intense workouts and training sessions.',
        imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
        tags: ['athletic', 'gym', 'workout', 'performance'],
        isPrivate: false,
        userId: userIdMapping.charlie,
        items: {
          create: [
            {
              name: 'Moisture-Wicking Tank',
              category: 'UPPERWEAR',
              description: 'Breathable athletic tank top',
              purchaseUrl: 'https://example.com/athletic-tank',
            },
            {
              name: 'Athletic Shorts',
              category: 'LOWERWEAR',
              description: 'Comfortable athletic shorts',
              purchaseUrl: 'https://example.com/athletic-shorts',
            },
            {
              name: 'Running Shoes',
              category: 'FOOTWEAR',
              description: 'Supportive running shoes',
              purchaseUrl: 'https://example.com/running-shoes',
            },
            {
              name: 'Sports Socks',
              category: 'SOCKS',
              description: 'Moisture-wicking sports socks',
            },
          ],
        },
      },
    }),
    prisma.outfit.create({
      data: {
        name: 'Cozy Home Office',
        description: 'Comfortable yet presentable outfit for working from home and video calls.',
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
        tags: ['work', 'home', 'comfortable', 'casual'],
        isPrivate: true,
        userId: userIdMapping.charlie,
        items: {
          create: [
            {
              name: 'Soft Sweater',
              category: 'UPPERWEAR',
              description: 'Comfortable soft sweater',
              purchaseUrl: 'https://example.com/soft-sweater',
            },
            {
              name: 'Leggings',
              category: 'LOWERWEAR',
              description: 'Comfortable leggings',
              purchaseUrl: 'https://example.com/leggings',
            },
            {
              name: 'Slippers',
              category: 'FOOTWEAR',
              description: 'Cozy home slippers',
            },
          ],
        },
      },
    }),

    // Diana's outfits
    prisma.outfit.create({
      data: {
        name: 'Outdoor Adventure',
        description: 'Durable and comfortable outfit for hiking and outdoor activities.',
        imageUrl: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop',
        tags: ['outdoor', 'hiking', 'adventure', 'durable'],
        isPrivate: false,
        userId: userIdMapping.diana,
        items: {
          create: [
            {
              name: 'Moisture-Wicking Shirt',
              category: 'UPPERWEAR',
              description: 'Quick-dry hiking shirt',
              purchaseUrl: 'https://example.com/hiking-shirt',
            },
            {
              name: 'Hiking Pants',
              category: 'LOWERWEAR',
              description: 'Durable hiking pants',
              purchaseUrl: 'https://example.com/hiking-pants',
            },
            {
              name: 'Hiking Boots',
              category: 'FOOTWEAR',
              description: 'Waterproof hiking boots',
              purchaseUrl: 'https://example.com/hiking-boots',
            },
            {
              name: 'Backpack',
              category: 'ACCESSORIES',
              description: 'Hiking backpack',
            },
          ],
        },
      },
    }),
    prisma.outfit.create({
      data: {
        name: 'Casual Coffee Run',
        description: 'Simple and comfortable outfit for running errands and coffee dates.',
        imageUrl: 'https://images.unsplash.com/photo-1489980557514-251d61e3eeb6?w=400&h=400&fit=crop',
        tags: ['casual', 'comfortable', 'errands', 'simple'],
        isPrivate: false,
        userId: userIdMapping.diana,
        items: {
          create: [
            {
              name: 'Oversized Sweater',
              category: 'UPPERWEAR',
              description: 'Comfortable oversized sweater',
              purchaseUrl: 'https://example.com/oversized-sweater',
            },
            {
              name: 'Skinny Jeans',
              category: 'LOWERWEAR',
              description: 'Comfortable skinny jeans',
              purchaseUrl: 'https://example.com/skinny-jeans',
            },
            {
              name: 'Sneakers',
              category: 'FOOTWEAR',
              description: 'Casual sneakers',
              purchaseUrl: 'https://example.com/sneakers',
            },
            {
              name: 'Crossbody Bag',
              category: 'ACCESSORIES',
              description: 'Small crossbody bag',
            },
          ],
        },
      },
    }),

    // Test user's outfits
    prisma.outfit.create({
      data: {
        name: 'Summer Casual Outfit',
        description: 'A comfortable summer outfit for casual occasions',
        imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop',
        tags: ['casual', 'summer', 'comfortable'],
        isPrivate: false,
        userId: userIdMapping.test,
        items: {
          create: [
            {
              name: 'Cotton T-Shirt',
              category: 'UPPERWEAR',
              description: 'Comfortable cotton t-shirt',
              purchaseUrl: 'https://example.com/tshirt',
            },
            {
              name: 'Jeans',
              category: 'LOWERWEAR',
              description: 'Blue denim jeans',
              purchaseUrl: 'https://example.com/jeans',
            },
          ],
        },
      },
    }),
    prisma.outfit.create({
      data: {
        name: 'Private Summer Casual Outfit',
        description: 'A private summer outfit for testing',
        imageUrl: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop',
        tags: ['private', 'test', 'summer'],
        isPrivate: true,
        userId: userIdMapping.test,
        items: {
          create: [
            {
              name: 'Private Shirt',
              category: 'UPPERWEAR',
              description: 'A private shirt',
              purchaseUrl: 'https://example.com/private-shirt',
            },
            {
              name: 'Private Pants',
              category: 'LOWERWEAR',
              description: 'Private pants',
              purchaseUrl: 'https://example.com/private-pants',
            },
          ],
        },
      },
    }),
  ]);

  console.log('✅ Seeding completed successfully!');
  console.log(`📊 Created ${users.length} users and ${outfits.length} outfits`);
  console.log('🔑 Test account: test@example.com / password123');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seeding failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
