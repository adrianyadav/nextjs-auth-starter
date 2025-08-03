import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import prisma from '@/lib/prisma';

export async function isAdmin(): Promise<boolean> {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return false;
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { isAdmin: true }
        });

        return user?.isAdmin || false;
    } catch (error) {
        console.error('Error checking admin status:', error);
        return false;
    }
}

export async function getCurrentUser() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return null;
        }

        return await prisma.user.findUnique({
            where: { email: session.user.email },
            select: {
                id: true,
                name: true,
                email: true,
                isAdmin: true,
                image: true
            }
        });
    } catch (error) {
        console.error('Error getting current user:', error);
        return null;
    }
} 