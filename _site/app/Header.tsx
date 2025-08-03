"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="w-full bg-background/95 backdrop-blur-sm border-b border-border/50 shadow-lg py-4 px-8 sticky top-0 z-50">
      <nav className="flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold hover:opacity-80 transition-all duration-300 transform hover:scale-105">
          <div className="w-8 h-8 bg-gradient-royal rounded-lg flex items-center justify-center shadow-md">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <span className="text-gradient-royal">OutfitSave</span>
        </Link>
        <div className="flex items-center space-x-4">
          <Button asChild variant="outline" className="border-royal/30 text-royal hover:bg-royal hover:text-white transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md">
            <Link href="/outfits">
              Browse
            </Link>
          </Button>
          {session ? (
            <>
              <Button asChild variant="outline" className="border-royal/30 text-royal hover:bg-royal hover:text-white transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md">
                <Link href="/my-outfits">
                  My Outfits
                </Link>
              </Button>
              <div className="flex items-center space-x-4">
                <div className="text-sm text-muted-foreground bg-muted/50 px-3 py-2 rounded-lg border border-border/50">
                  {session.user?.name && <div className="font-medium">{session.user.name}</div>}
                  <div className="text-xs opacity-75">{session.user?.email}</div>
                </div>
                <Button
                  onClick={() => signOut()}
                  variant="destructive"
                  className="transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md"
                >
                  Sign Out
                </Button>
              </div>
            </>
          ) : (
            <Button asChild className="bg-gradient-royal hover:bg-gradient-royal-light text-white transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg">
              <Link href="/login">
                Sign In
              </Link>
            </Button>
          )}
        </div>
      </nav>
    </header>
  );
}
