import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import prisma from "@/lib/prisma";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_request: NextRequest) {
    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const session = await getServerSession(authOptions as any) as any;
        if (!session?.user?.email) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
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

        // Get all items from user's outfits
        const items = await prisma.outfitItem.findMany({
            where: {
                outfit: {
                    userId: user.id,
                },
            },
            select: {
                name: true,
                category: true,
                description: true,
                purchaseUrl: true,
                imageUrl: true,
            },
            orderBy: {
                name: 'asc',
            },
        });

        // Define the type for unique items
        interface UniqueItem {
            name: string;
            category: string;
            description: string | null;
            purchaseUrl: string | null;
            imageUrl: string | null;
            usageCount: number;
        }

        // Group items by name and category to get unique items with usage count
        const uniqueItems = items.reduce((acc, item) => {
            const key = `${item.name}-${item.category}`;
            if (!acc[key]) {
                acc[key] = {
                    name: item.name,
                    category: item.category,
                    description: item.description,
                    purchaseUrl: item.purchaseUrl,
                    imageUrl: item.imageUrl,
                    usageCount: 1,
                };
            } else {
                acc[key].usageCount += 1;
            }
            return acc;
        }, {} as Record<string, UniqueItem>);

        const result = Object.values(uniqueItems).sort((a, b) => {
            // Sort by usage count (descending), then by name (ascending)
            if (b.usageCount !== a.usageCount) {
                return b.usageCount - a.usageCount;
            }
            return a.name.localeCompare(b.name);
        });

        return NextResponse.json(result);
    } catch (error) {
        console.error("Error fetching user items:", error);
        return NextResponse.json(
            { error: "Failed to fetch items" },
            { status: 500 }
        );
    }
}
