import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { type NextAuthOptions } from "next-auth";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        name: { label: "Name", type: "name" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        // Normalize email to lowercase for case-insensitive comparison
        const normalizedEmail = credentials.email.toLowerCase().trim();

        const user = await prisma.user.findUnique({
          where: { email: normalizedEmail },
          include: {
            accounts: true, // Include linked accounts to check if user has Google account
          },
        });

        // Check if user exists
        if (!user) {
          throw new Error("No account found with this email address");
        }

        // Check if user has a password set
        if (!user.password) {
          const hasGoogleAccount = user.accounts.some(account => account.provider === 'google');
          if (hasGoogleAccount) {
            throw new Error("This account was created with Google. Please sign in with Google or set a password first.");
          } else {
            throw new Error("This account doesn't have a password set. Please use 'Forgot Password' to set one.");
          }
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isCorrectPassword) {
          throw new Error("Incorrect password");
        }

        return user;
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login", // Redirect to login page on auth errors
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // Handle Google sign-in
      if (account?.provider === 'google') {
        // Check if user already exists with this email
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
          include: { accounts: true },
        });

        if (existingUser) {
          // User exists - check if they have a password set
          if (existingUser.password) {
            // User has both Google and password - this is fine
            return true;
          } else {
            // User only has Google account - this is also fine
            return true;
          }
        }

        // New user - create account
        return true;
      }

      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.image = token.image as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      if (isNewUser && account?.provider === 'google') {
        // Log new Google user registration
        console.log(`New user registered via Google: ${user.email}`);
      }
    },
  },
} satisfies NextAuthOptions;