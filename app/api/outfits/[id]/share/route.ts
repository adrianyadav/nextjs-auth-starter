import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import prisma from "@/lib/prisma";
import { createOrGetShareSlug, getShareUrl } from "@/lib/share-utils";

export async function POST(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const session = await getServerSession(authOptions as any) as any;
        if (!session?.user?.email) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { id } = await context.params;
        const outfitId = parseInt(id);
        if (isNaN(outfitId)) {
            return NextResponse.json(
                { error: "Invalid outfit ID" },
                { status: 400 }
            );
        }

        // Check if outfit exists and belongs to the user
        const outfit = await prisma.outfit.findFirst({
            where: {
                id: outfitId,
                user: {
                    email: session.user.email,
                },
            },
        });

        if (!outfit) {
            return NextResponse.json(
                { error: "Outfit not found" },
                { status: 404 }
            );
        }

        // Check if outfit is private
        if (outfit.isPrivate) {
            return NextResponse.json(
                { error: "Cannot share private outfits" },
                { status: 400 }
            );
        }

        // Generate or get share slug
        const shareSlug = await createOrGetShareSlug(outfitId);
        const shareUrl = getShareUrl(shareSlug);

        return NextResponse.json({
            shareSlug,
            shareUrl,
        });
    } catch (error) {
        console.error("Error generating share link:", error);
        return NextResponse.json(
            { error: "Failed to generate share link" },
            { status: 500 }
        );
    }
} 