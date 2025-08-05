import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Delete Test Outfits Script
 * 
 * This script ONLY deletes outfits that have the "test" tag.
 * This ensures that:
 * - Test data created during test runs is cleaned up
 * - Seeded data (like the outfits in prisma/seed.ts) is NEVER deleted
 * - Only outfits explicitly marked with "test" tag are removed
 * 
 * Safety: The script uses a very specific filter to prevent accidental deletion
 * of production or seeded data.
 */

async function deleteTestOutfits() {
    console.log('🧹 Starting test outfits cleanup...');

    try {
        // Only delete outfits that have the "test" tag
        // This ensures we only delete test data and never touch seeded data
        const testOutfits = await prisma.outfit.findMany({
            where: {
                tags: { has: 'test' }
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

        // Safety check: Confirm we're only deleting outfits with "test" tag
        console.log('🔒 Safety check: Only outfits with "test" tag will be deleted');
        console.log('🔒 This ensures seeded data and production data are protected');

        // Delete only outfits with "test" tag (this will cascade delete related items)
        const deletedOutfits = await prisma.outfit.deleteMany({
            where: {
                tags: { has: 'test' }
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