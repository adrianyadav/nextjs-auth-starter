import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import prisma from "@/lib/prisma";

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const session = await getServerSession(authOptions as any) as any;

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const outfitId = parseInt(id);

        if (isNaN(outfitId)) {
            return NextResponse.json({ error: "Invalid outfit ID" }, { status: 400 });
        }

        // Get the original outfit
        const originalOutfit = await prisma.outfit.findUnique({
            where: { id: outfitId },
            include: {
                items: true,
            }
        });

        if (!originalOutfit) {
            return NextResponse.json({ error: "Outfit not found" }, { status: 404 });
        }

        // Check if outfit is public
        if (originalOutfit.isPrivate) {
            return NextResponse.json({ error: "Cannot save private outfits" }, { status: 403 });
        }

        // Check if user already has this outfit
        const existingOutfit = await prisma.outfit.findFirst({
            where: {
                userId: session.user.id,
                name: originalOutfit.name,
                // You might want to add more checks to prevent duplicates
            }
        });

        if (existingOutfit) {
            return NextResponse.json({ error: "You already have this outfit" }, { status: 409 });
        }

        // Create a copy of the outfit for the current user
        const savedOutfit = await prisma.outfit.create({
            data: {
                name: originalOutfit.name,
                description: originalOutfit.description,
                imageUrl: originalOutfit.imageUrl,
                tags: originalOutfit.tags,
                isPrivate: true, // Make it private by default
                userId: session.user.id,
                items: {
                    create: originalOutfit.items.map(item => ({
                        name: item.name,
                        category: item.category,
                        description: item.description,
                        purchaseUrl: item.purchaseUrl,
                        imageUrl: item.imageUrl,
                    }))
                }
            },
            include: {
                items: true,
            }
        });

        return NextResponse.json({
            message: "Outfit saved successfully",
            outfit: savedOutfit
        });
    } catch (error) {
        console.error("Error saving outfit:", error);
        return NextResponse.json({ error: "Failed to save outfit" }, { status: 500 });
    }
} 