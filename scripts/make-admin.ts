import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function makeAdmin(email: string) {
    try {
        const user = await prisma.user.update({
            where: { email },
            data: { isAdmin: true },
            select: { id: true, name: true, email: true, isAdmin: true }
        });

        console.log('✅ User made admin successfully!');
        console.log(`👤 User: ${user.name} (${user.email})`);
        console.log(`🔑 Admin status: ${user.isAdmin ? 'Yes' : 'No'}`);

        return user;
    } catch (error) {
        console.error('❌ Error making user admin:', error);
        throw error;
    }
}

// Get email from command line argument
const email = process.argv[2];

if (!email) {
    console.error('❌ Please provide an email address');
    console.log('Usage: npx tsx scripts/make-admin.ts user@example.com');
    process.exit(1);
}

makeAdmin(email)
    .then(() => {
        console.log('🎉 Admin setup complete!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('💥 Failed to make user admin:', error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    }); 