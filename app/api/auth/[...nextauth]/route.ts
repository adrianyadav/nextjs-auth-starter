import NextAuth from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { authOptions } from "@/auth";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handler = NextAuth(authOptions as any);
export { handler as GET, handler as POST };

declare module "next-auth" {
  interface Session {
    user: { id: string; name: string; email: string; image?: string };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email?: string;
    name?: string;
    image?: string;
  }
}
