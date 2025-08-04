import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = 10;
        const skip = (page - 1) * limit;

        const [outfits, total] = await Promise.all([
            prisma.outfit.findMany({
                where: {
                    isPrivate: false, // Only show public outfits
                },
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc",
                },
                include: {
                    user: {
                        select: {
                            name: true,
                        },
                    },
                    items: true, // Change from 'OutfitItem' to 'items'
                },
            }),
            prisma.outfit.count({
                where: {
                    isPrivate: false, // Only count public outfits
                },
            }),
        ]);

        const totalPages = Math.ceil(total / limit);

        return NextResponse.json({
            outfits,
            totalPages,
            currentPage: page,
        });
    } catch (error) {
        console.error("Error fetching outfits:", error);
        return NextResponse.json(
            { error: "Failed to fetch outfits" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        // Check if prisma is available
        if (!prisma) {
            console.error("Prisma client is not available");
            return NextResponse.json(
                { error: "Database connection error" },
                { status: 500 }
            );
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const session = await getServerSession(authOptions as any) as any;
        if (!session?.user?.email) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { name, description, imageUrl, tags, isPrivate, items } = body;

        if (!name) {
            return NextResponse.json(
                { error: "Name is required" },
                { status: 400 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        const outfit = await prisma.outfit.create({
            data: {
                name,
                description,
                imageUrl,
                tags: tags || [],
                isPrivate: isPrivate || false,
                userId: user.id,
                items: {
                    create: items || [], // This should use 'items' now
                },
            },
            include: {
                user: {
                    select: {
                        name: true,
                    },
                },
                items: true, // Change from 'OutfitItem' to 'items'
            },
        });

        return NextResponse.json(outfit);
    } catch (error) {
        console.error("Error creating outfit:", error);
        return NextResponse.json(
            { error: "Failed to create outfit" },
            { status: 500 }
        );
    }
} 