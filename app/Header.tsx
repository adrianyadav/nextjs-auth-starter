"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="w-full bg-background/95 backdrop-blur-sm border-b border-border/50 shadow-lg py-4 px-8 sticky top-0 z-50">
      <nav className="flex justify-between items-center">
        <Logo variant="header" />
        <div className="flex items-center space-x-4">
          <Button asChild variant="outline" className="border-royal/30 text-royal hover:bg-royal hover:text-white transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md" style={{ color: 'black' }}>
            <Link href="/outfits">
              Browse
            </Link>
          </Button>
          {session ? (
            <>
              <Button asChild variant="outline" className="border-royal/30 text-royal hover:bg-royal hover:text-white transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md" style={{ color: 'black' }}>
                <Link href="/my-outfits">
                  My Outfits
                </Link>
              </Button>
              <div className="flex items-center space-x-4">
                <div className="text-sm px-3 py-2">
                  {session.user?.name && <div className="font-medium">{session.user.name}</div>}
                </div>
                <Button
                  onClick={() => signOut()}
                  variant="destructive"
                  className="bg-gradient-royal hover:bg-gradient-royal-light text-white transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
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
