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
                },
            }),
            prisma.outfit.count(),
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

        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { name, description, imageUrl, tags } = body;

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
                userId: user.id,
            },
            include: {
                user: {
                    select: {
                        name: true,
                    },
                },
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