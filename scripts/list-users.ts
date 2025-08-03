import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function listUsers() {
    try {
        const users = await prisma.user.findMany({
            select: { id: true, name: true, email: true, isAdmin: true }
        });

        console.log('📋 All users in database:');
        console.log('─'.repeat(50));

        users.forEach((user, index) => {
            console.log(`${index + 1}. ${user.name || 'No name'} (${user.email})`);
            console.log(`   Admin: ${user.isAdmin ? '✅ Yes' : '❌ No'}`);
            console.log(`   ID: ${user.id}`);
            console.log('');
        });

        return users;
    } catch (error) {
        console.error('❌ Error listing users:', error);
        throw error;
    }
}

listUsers()
    .then(() => {
        console.log('🎉 User listing complete!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('💥 Failed to list users:', error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    }); 