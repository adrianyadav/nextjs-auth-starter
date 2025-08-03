import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import prisma from '@/lib/prisma';

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Get the current session
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Check if user is admin
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { isAdmin: true }
        });

        if (!user?.isAdmin) {
            return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
        }

        // Await the params in Next.js 15
        const { id } = await params;
        const outfitId = parseInt(id);

        if (isNaN(outfitId)) {
            return NextResponse.json({ error: 'Invalid outfit ID' }, { status: 400 });
        }

        // Get the outfit to check if it's public
        const outfit = await prisma.outfit.findUnique({
            where: { id: outfitId },
            select: { isPrivate: true, name: true }
        });

        if (!outfit) {
            return NextResponse.json({ error: 'Outfit not found' }, { status: 404 });
        }

        if (outfit.isPrivate) {
            return NextResponse.json({ error: 'Cannot delete private outfits' }, { status: 400 });
        }

        // Delete the outfit (cascade will delete items)
        await prisma.outfit.delete({
            where: { id: outfitId }
        });

        return NextResponse.json({
            message: `Successfully deleted outfit: ${outfit.name}`,
            deletedOutfit: outfit.name
        });

    } catch (error) {
        console.error('Admin delete outfit error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
} 