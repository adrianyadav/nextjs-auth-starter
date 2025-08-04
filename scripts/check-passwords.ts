import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function checkPasswords() {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                password: true,
                accounts: {
                    select: {
                        provider: true
                    }
                }
            }
        });

        console.log('🔍 Checking user passwords and OAuth accounts:');
        console.log('─'.repeat(60));

        users.forEach((user, index) => {
            console.log(`${index + 1}. ${user.name || 'No name'} (${user.email})`);
            console.log(`   - Has password: ${user.password ? '✅ YES' : '❌ NO'}`);
            console.log(`   - OAuth providers: ${user.accounts.map(acc => acc.provider).join(', ') || 'None'}`);
            console.log('');
        });

        // Test password for test user
        const testUser = users.find(u => u.email === 'test@example.com');
        if (testUser && testUser.password) {
            console.log('🧪 Testing password authentication for test@example.com...');
            const isCorrect = await bcrypt.compare('password123', testUser.password);
            console.log(`Password 'password123' is correct: ${isCorrect ? '✅ YES' : '❌ NO'}`);
        } else if (testUser) {
            console.log('⚠️  test@example.com has no password set');
        }

        return users;
    } catch (error) {
        console.error('❌ Error checking passwords:', error);
        throw error;
    }
}

checkPasswords()
    .then(() => {
        console.log('🎉 Password check complete!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('💥 Failed to check passwords:', error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    }); 