import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function testAuth() {
    try {
        console.log('🧪 Testing authentication flow...\n');

        // Test 1: Check if test user exists and has password
        const testUser = await prisma.user.findUnique({
            where: { email: 'test@example.com' },
            select: { id: true, email: true, name: true, password: true }
        });

        if (!testUser) {
            console.log('❌ Test user not found');
            return;
        }

        console.log(`✅ Found test user: ${testUser.name} (${testUser.email})`);
        console.log(`   Has password: ${testUser.password ? 'YES' : 'NO'}\n`);

        if (!testUser.password) {
            console.log('❌ Test user has no password set');
            return;
        }

        // Test 2: Test password comparison
        console.log('🔐 Testing password authentication...');

        const testCases = [
            { password: 'password123', expected: true, description: 'Correct password' },
            { password: 'wrongpassword', expected: false, description: 'Wrong password' },
            { password: '', expected: false, description: 'Empty password' },
            { password: 'Password123', expected: false, description: 'Case sensitive test' }
        ];

        for (const testCase of testCases) {
            const isCorrect = await bcrypt.compare(testCase.password, testUser.password);
            const status = isCorrect === testCase.expected ? '✅' : '❌';
            console.log(`${status} ${testCase.description}: "${testCase.password}" -> ${isCorrect}`);
        }

        console.log('\n🎯 Authentication test complete!');

    } catch (error) {
        console.error('❌ Error testing auth:', error);
    } finally {
        await prisma.$disconnect();
    }
}

testAuth(); 