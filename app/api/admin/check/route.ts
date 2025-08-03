import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ isAdmin: false });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { isAdmin: true }
        });

        return NextResponse.json({ isAdmin: user?.isAdmin || false });

    } catch (error) {
        console.error('Error checking admin status:', error);
        return NextResponse.json({ isAdmin: false });
    }
} 