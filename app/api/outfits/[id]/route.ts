import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const outfit = await prisma.outfit.findUnique({
            where: {
                id: parseInt(id),
            },
            include: {
                user: {
                    select: {
                        name: true,
                    },
                },
            },
        });

        if (!outfit) {
            return NextResponse.json(
                { error: "Outfit not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(outfit);
    } catch (error) {
        console.error("Error fetching outfit:", error);
        return NextResponse.json(
            { error: "Failed to fetch outfit" },
            { status: 500 }
        );
    }
}
