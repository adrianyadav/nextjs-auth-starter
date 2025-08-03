"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { Menu, X } from "lucide-react";

export default function Header() {
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isDevelopment = process.env.NODE_ENV === 'development';

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="w-full bg-background/95 backdrop-blur-sm border-b border-border/50 shadow-lg py-4 px-4 sm:px-6 lg:px-8 sticky top-0 z-50">
      <nav className="flex justify-between items-center">
        <Logo variant="header" />

        {/* Desktop Navigation - Hidden on mobile */}
        <div className="hidden md:flex items-center space-x-4">
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
                  data-testid="logout-button"
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

          {/* Development-only docs link */}
          {isDevelopment && (
            <Button asChild variant="outline" className="border-orange-300 text-orange-600 hover:bg-orange-50 transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md">
              <Link href="/docs">
                📚 Docs
              </Link>
            </Button>
          )}
        </div>

        {/* Mobile Menu Button - Visible only on mobile */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </nav>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-sm border-b border-border/50 shadow-lg">
          <div className="px-4 py-6 space-y-4">
            <Button
              asChild
              variant="outline"
              className="w-full justify-center border-royal/30 text-royal hover:bg-royal hover:text-white transition-all duration-300 shadow-sm hover:shadow-md"
              style={{ color: 'black' }}
              onClick={closeMobileMenu}
            >
              <Link href="/outfits">
                Browse
              </Link>
            </Button>

            {session ? (
              <>
                <Button
                  asChild
                  variant="outline"
                  className="w-full justify-center border-royal/30 text-royal hover:bg-royal hover:text-white transition-all duration-300 shadow-sm hover:shadow-md"
                  style={{ color: 'black' }}
                  onClick={closeMobileMenu}
                >
                  <Link href="/my-outfits">
                    My Outfits
                  </Link>
                </Button>

                <div className="space-y-4">
                  {session.user?.name && (
                    <div className="text-center py-2 px-3 rounded-md">
                      <div className="font-medium text-sm">{session.user.name}</div>
                    </div>
                  )}
                  <Button
                    data-testid="logout-button-mobile"
                    onClick={() => {
                      signOut();
                      closeMobileMenu();
                    }}
                    variant="destructive"
                    className="w-full justify-center bg-gradient-royal hover:bg-gradient-royal-light text-white transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    Sign Out
                  </Button>
                </div>
              </>
            ) : (
              <Button
                asChild
                className="w-full justify-center bg-gradient-royal hover:bg-gradient-royal-light text-white transition-all duration-300 shadow-md hover:shadow-lg"
                onClick={closeMobileMenu}
              >
                <Link href="/login">
                  Sign In
                </Link>
              </Button>
            )}

            {/* Development-only docs link for mobile */}
            {isDevelopment && (
              <Button
                asChild
                variant="outline"
                className="w-full justify-center border-orange-300 text-orange-600 hover:bg-orange-50 transition-all duration-300 shadow-sm hover:shadow-md"
                onClick={closeMobileMenu}
              >
                <Link href="/docs">
                  📚 Docs
                </Link>
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
