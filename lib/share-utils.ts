import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export function generateShareSlug(outfitName: string): string {
    // Convert outfit name to a URL-friendly slug
    const baseSlug = outfitName
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single
        .trim();

    // Add a random suffix to ensure uniqueness
    const randomSuffix = Math.random().toString(36).substring(2, 8);

    return `${baseSlug}-${randomSuffix}`;
}

export async function createOrGetShareSlug(outfitId: number): Promise<string> {
    // Check if outfit already has a share slug
    const outfit = await prisma.outfit.findUnique({
        where: { id: outfitId },
        select: { shareSlug: true, name: true }
    });

    if (!outfit) {
        throw new Error('Outfit not found');
    }

    if (outfit.shareSlug) {
        return outfit.shareSlug;
    }

    // Generate a new share slug
    let shareSlug: string | undefined;
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 10;

    while (!isUnique && attempts < maxAttempts) {
        shareSlug = generateShareSlug(outfit.name);

        // Check if slug is unique
        const existingOutfit = await prisma.outfit.findUnique({
            where: { shareSlug }
        });

        if (!existingOutfit) {
            isUnique = true;
        } else {
            attempts++;
        }
    }

    if (!isUnique || !shareSlug) {
        throw new Error('Unable to generate unique share slug');
    }

    // Update the outfit with the new share slug
    await prisma.outfit.update({
        where: { id: outfitId },
        data: { shareSlug }
    });

    return shareSlug;
}

export function getShareUrl(shareSlug: string): string {
    // In production, this would be your actual domain
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    return `${baseUrl}/outfits/share/${shareSlug}`;
} 