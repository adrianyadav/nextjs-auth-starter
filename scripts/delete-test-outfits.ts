import { PrismaClient } from '@prisma/client';
import { config } from 'dotenv';

// Load environment variables from .env file
config();

// For Prisma 6.x with local databases, we need to use the proper configuration
const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL
        }
    },
    // Add this to handle local database connections
    log: ['query', 'info', 'warn', 'error'],
});

/**
 * Delete Test Outfits Script
 * 
 * This script deletes:
 * 1. Outfits that have any tag containing "test" (e.g., "save-test", "duplicate-test", "test", "api")
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
    console.log(`�� Using database: ${process.env.DATABASE_URL?.replace(/\/\/.*@/, '//***:***@')}`);

    try {
        // Find outfits to delete: those with any tag containing "test", "Test" in name, OR the specific seeded outfit
        const outfitsToDelete = await prisma.outfit.findMany({
            where: {
                OR: [
                    // Any tag containing "test" (e.g., "save-test", "duplicate-test", "test", "api")
                    { tags: { has: 'test' } },
                    { tags: { has: 'save-test' } },
                    { tags: { has: 'duplicate-test' } },
                    { tags: { has: 'update-test' } },
                    { tags: { has: 'delete-test' } },
                    { tags: { has: 'get-test' } },
                    { tags: { has: 'private-test' } },
                    { tags: { has: 'api' } },
                    // Outfits with "Test" in name
                    { name: { contains: 'Test' } },
                    // Specific seeded outfit
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
            if (outfit.tags.some(tag => tag.includes('test'))) {
                reason = 'test-related tag';
            } else if (outfit.name.includes('Test')) {
                reason = 'test outfit name';
            } else {
                reason = 'seeded outfit';
            }
            console.log(`  - "${outfit.name}" (${outfit.isPrivate ? 'Private' : 'Public'}) by ${outfit.user?.email || 'Unknown'} - ${reason}`);
            console.log(`    Tags: [${outfit.tags.join(', ')}]`);
        }

        if (outfitsToDelete.length === 0) {
            console.log('✅ No outfits found to delete');
            return;
        }

        // Safety check: Confirm what we're deleting
        console.log('�� Safety check: Will delete outfits with test-related tags, "Test" in name, and "Summer Casual Outfit"');

        // Delete the outfits (this will cascade delete related items)
        const deletedOutfits = await prisma.outfit.deleteMany({
            where: {
                OR: [
                    // Any tag containing "test" (e.g., "save-test", "duplicate-test", "test", "api")
                    { tags: { has: 'test' } },
                    { tags: { has: 'save-test' } },
                    { tags: { has: 'duplicate-test' } },
                    { tags: { has: 'update-test' } },
                    { tags: { has: 'delete-test' } },
                    { tags: { has: 'get-test' } },
                    { tags: { has: 'private-test' } },
                    { tags: { has: 'api' } },
                    // Outfits with "Test" in name
                    { name: { contains: 'Test' } },
                    // Specific seeded outfit
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