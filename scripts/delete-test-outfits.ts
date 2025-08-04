import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function deleteTestOutfits() {
    console.log('🧹 Starting test outfits cleanup...');

    try {
        // First, let's see what test outfits exist
        const testOutfits = await prisma.outfit.findMany({
            where: {
                OR: [
                    // Test outfits with various naming patterns
                    { name: { contains: 'test', mode: 'insensitive' } },
                    { name: { contains: 'Test', mode: 'insensitive' } },
                    { name: { contains: 'TEST', mode: 'insensitive' } },
                    { name: { contains: 'Summer Casual Outfit', mode: 'insensitive' } },
                    { name: { contains: 'Private Summer Casual Outfit', mode: 'insensitive' } },
                    { name: { contains: 'Outfit ', mode: 'insensitive' } }, // Matches "Outfit 1234567890"
                    { name: { contains: 'Cotton T-Shirt', mode: 'insensitive' } },
                    { name: { contains: 'Jeans', mode: 'insensitive' } },

                    // Test descriptions
                    { description: { contains: 'test', mode: 'insensitive' } },
                    { description: { contains: 'Test', mode: 'insensitive' } },
                    { description: { contains: 'TEST', mode: 'insensitive' } },
                    { description: { contains: 'A test outfit', mode: 'insensitive' } },
                    { description: { contains: 'A comfortable summer outfit', mode: 'insensitive' } },
                    { description: { contains: 'Comfortable cotton t-shirt', mode: 'insensitive' } },
                    { description: { contains: 'Blue denim jeans', mode: 'insensitive' } },

                    // Test tags
                    { tags: { has: 'test' } },
                    { tags: { has: 'casual' } },
                    { tags: { has: 'summer' } },
                    { tags: { has: 'comfortable' } },
                ]
            },
            include: {
                user: {
                    select: {
                        email: true,
                        name: true
                    }
                },
                items: true
            }
        });

        console.log(`📋 Found ${testOutfits.length} test outfits to delete:`);

        for (const outfit of testOutfits) {
            console.log(`  - "${outfit.name}" (${outfit.isPrivate ? 'Private' : 'Public'}) by ${outfit.user?.email || 'Unknown'}`);
        }

        if (testOutfits.length === 0) {
            console.log('✅ No test outfits found to delete');
            return;
        }

        // Delete all test outfits (this will cascade delete related items)
        const deletedOutfits = await prisma.outfit.deleteMany({
            where: {
                OR: [
                    // Test outfits with various naming patterns
                    { name: { contains: 'test', mode: 'insensitive' } },
                    { name: { contains: 'Test', mode: 'insensitive' } },
                    { name: { contains: 'TEST', mode: 'insensitive' } },
                    { name: { contains: 'Summer Casual Outfit', mode: 'insensitive' } },
                    { name: { contains: 'Private Summer Casual Outfit', mode: 'insensitive' } },
                    { name: { contains: 'Outfit ', mode: 'insensitive' } }, // Matches "Outfit 1234567890"
                    { name: { contains: 'Cotton T-Shirt', mode: 'insensitive' } },
                    { name: { contains: 'Jeans', mode: 'insensitive' } },
                    { name: { contains: 'Delete Test Outfit', mode: 'insensitive' } },
                    { name: { contains: 'Public Save Test Outfit', mode: 'insensitive' } },

                    // Test descriptions
                    { description: { contains: 'test', mode: 'insensitive' } },
                    { description: { contains: 'Test', mode: 'insensitive' } },
                    { description: { contains: 'TEST', mode: 'insensitive' } },
                    { description: { contains: 'A test outfit', mode: 'insensitive' } },
                    { description: { contains: 'A comfortable summer outfit', mode: 'insensitive' } },
                    { description: { contains: 'Comfortable cotton t-shirt', mode: 'insensitive' } },
                    { description: { contains: 'Blue denim jeans', mode: 'insensitive' } },

                    // Test tags
                    { tags: { has: 'test' } },
                    { tags: { has: 'casual' } },
                    { tags: { has: 'summer' } },
                    { tags: { has: 'comfortable' } },
                ]
            }
        });

        console.log(`🗑️  Successfully deleted ${deletedOutfits.count} test outfits`);

        console.log('✅ Test outfits cleanup completed successfully!');

    } catch (error) {
        console.error('❌ Error during test outfits cleanup:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

// Run the cleanup
deleteTestOutfits(); 