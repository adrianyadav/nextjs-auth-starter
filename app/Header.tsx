"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="w-full bg-background border-b shadow-sm py-4 px-8">
      <nav className="flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-foreground hover:text-primary transition-colors">
          OutfitSave
        </Link>
        <div className="flex items-center space-x-4">
          <Button asChild variant="outline">
            <Link href="/outfits">
              My Outfits
            </Link>
          </Button>
          {session ? (
            <>
              <Button asChild>
                <Link href="/outfits/new">
                  Save Outfit
                </Link>
              </Button>
              <div className="flex items-center space-x-4">
                <div className="text-sm text-muted-foreground">
                  {session.user?.name && <div>{session.user.name}</div>}
                  <div>{session.user?.email}</div>
                </div>
                <Button
                  onClick={() => signOut()}
                  variant="destructive"
                >
                  Sign Out
                </Button>
              </div>
            </>
          ) : (
            <Button asChild>
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
