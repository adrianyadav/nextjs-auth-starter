import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanupTestData() {
    console.log('�� Starting test data cleanup...');

    try {
        // Delete test outfits and their related data
        const deletedOutfits = await prisma.outfit.deleteMany({
            where: {
                OR: [
                    { name: { contains: 'test', mode: 'insensitive' } },
                    { name: { contains: 'Test', mode: 'insensitive' } },
                    { name: { contains: 'TEST', mode: 'insensitive' } },
                    { description: { contains: 'test', mode: 'insensitive' } },
                    { description: { contains: 'Test', mode: 'insensitive' } },
                    { description: { contains: 'TEST', mode: 'insensitive' } },
                ]
            }
        });

        console.log(`🗑️  Deleted ${deletedOutfits.count} test outfits`);

        // Delete test users (be careful with this one)
        const deletedUsers = await prisma.user.deleteMany({
            where: {
                OR: [
                    { email: { contains: 'test', mode: 'insensitive' } },
                    { email: { contains: 'Test', mode: 'insensitive' } },
                    { email: { contains: 'TEST', mode: 'insensitive' } },
                    { name: { contains: 'test', mode: 'insensitive' } },
                    { name: { contains: 'Test', mode: 'insensitive' } },
                    { name: { contains: 'TEST', mode: 'insensitive' } },
                ]
            }
        });

        console.log(`👤 Deleted ${deletedUsers.count} test users`);

        // Delete test accounts
        const deletedAccounts = await prisma.account.deleteMany({
            where: {
                OR: [
                    { providerAccountId: { contains: 'test', mode: 'insensitive' } },
                    { providerAccountId: { contains: 'Test', mode: 'insensitive' } },
                    { providerAccountId: { contains: 'TEST', mode: 'insensitive' } },
                ]
            }
        });

        console.log(`🔐 Deleted ${deletedAccounts.count} test accounts`);

        // Delete test sessions
        const deletedSessions = await prisma.session.deleteMany({
            where: {
                OR: [
                    { sessionToken: { contains: 'test', mode: 'insensitive' } },
                    { sessionToken: { contains: 'Test', mode: 'insensitive' } },
                    { sessionToken: { contains: 'TEST', mode: 'insensitive' } },
                ]
            }
        });

        console.log(`�� Deleted ${deletedSessions.count} test sessions`);



        console.log('✨ Test data cleanup completed successfully!');

    } catch (error) {
        console.error('❌ Error during test data cleanup:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

// Run the cleanup
cleanupTestData(); 