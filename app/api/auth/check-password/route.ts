import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions as any) as any;

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: "You must be logged in to check password status" },
                { status: 401 }
            );
        }

        // Find the user
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            hasPassword: !!user.password,
        });
    } catch (error) {
        console.error("Error checking password status:", error);
        return NextResponse.json(
            { error: "Failed to check password status" },
            { status: 500 }
        );
    }
} 