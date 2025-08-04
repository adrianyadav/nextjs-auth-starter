import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export async function POST(request: NextRequest) {
    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const session = await getServerSession(authOptions as any) as any;

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: "You must be logged in to set a password" },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { password } = body;

        if (!password || password.length < 6) {
            return NextResponse.json(
                { error: "Password must be at least 6 characters long" },
                { status: 400 }
            );
        }

        // Find the user
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: { accounts: true },
        });

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // Check if user already has a password
        if (user.password) {
            return NextResponse.json(
                { error: "Password is already set for this account" },
                { status: 400 }
            );
        }

        // Check if user has a Google account
        const hasGoogleAccount = user.accounts.some(account => account.provider === 'google');
        if (!hasGoogleAccount) {
            return NextResponse.json(
                { error: "This account was not created with Google" },
                { status: 400 }
            );
        }

        // Hash and set the password
        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.update({
            where: { email: session.user.email },
            data: { password: hashedPassword },
        });

        return NextResponse.json({
            message: "Password set successfully. You can now sign in with either Google or email/password.",
        });
    } catch (error) {
        console.error("Error setting password:", error);
        return NextResponse.json(
            { error: "Failed to set password" },
            { status: 500 }
        );
    }
} 