import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = 10;
        const skip = (page - 1) * limit;

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        const [outfits, total] = await Promise.all([
            prisma.outfit.findMany({
                where: {
                    userId: user.id,
                },
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc",
                },
                include: {
                    items: true, // This should now work after the migration
                },
            }),
            prisma.outfit.count({
                where: {
                    userId: user.id,
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
        console.error("Error fetching user outfits:", error);
        return NextResponse.json(
            { error: "Failed to fetch outfits" },
            { status: 500 }
        );
    }
} 