import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Delete Test Outfits Script
 * 
 * This script deletes:
 * 1. Outfits that have the "test" tag
 * 2. Outfits that have "Test" in their name (created by tests, even if tags were modified)
 * 3. The specific seeded outfit "Summer Casual Outfit"
 * 
 * This ensures that:
 * - Test data created during test runs is cleaned up
 * - Test outfits that had their tags modified are also cleaned up
 * - The specific seeded outfit is also removed
 * - Other seeded data remains protected
 */

async function deleteTestOutfits() {
    console.log('🧹 Starting test outfits cleanup...');

    try {
        // Find outfits to delete: those with "test" tag, "Test" in name, OR the specific seeded outfit
        const outfitsToDelete = await prisma.outfit.findMany({
            where: {
                OR: [
                    { tags: { has: 'test' } },
                    { name: { contains: 'Test' } },
                    { name: 'Summer Casual Outfit' }
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

        console.log(`📋 Found ${outfitsToDelete.length} outfits to delete:`);

        for (const outfit of outfitsToDelete) {
            let reason: string;
            if (outfit.tags.includes('test')) {
                reason = 'test tag';
            } else if (outfit.name.includes('Test')) {
                reason = 'test outfit name';
            } else {
                reason = 'seeded outfit';
            }
            console.log(`  - "${outfit.name}" (${outfit.isPrivate ? 'Private' : 'Public'}) by ${outfit.user?.email || 'Unknown'} - ${reason}`);
        }

        if (outfitsToDelete.length === 0) {
            console.log('✅ No outfits found to delete');
            return;
        }

        // Safety check: Confirm what we're deleting
        console.log('🔒 Safety check: Will delete outfits with "test" tag, "Test" in name, and "Summer Casual Outfit"');

        // Delete the outfits (this will cascade delete related items)
        const deletedOutfits = await prisma.outfit.deleteMany({
            where: {
                OR: [
                    { tags: { has: 'test' } },
                    { name: { contains: 'Test' } },
                    { name: 'Summer Casual Outfit' }
                ]
            }
        });

        console.log(`🗑️  Successfully deleted ${deletedOutfits.count} outfits`);

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