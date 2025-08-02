"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="w-full bg-white shadow-md py-4 px-8">
      <nav className="flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-gray-800 hover:text-purple-600 transition-colors">
          OutfitSave
        </Link>
        <div className="flex items-center space-x-4">
          <Link
            href="/outfits"
            className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition"
          >
            My Outfits
          </Link>
          {session ? (
            <>
              <Link
                href="/outfits/new"
                className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition"
              >
                Save Outfit
              </Link>
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-500">
                  {session.user?.name && <div>{session.user.name}</div>}
                  <div>{session.user?.email}</div>
                </div>
                <button
                  onClick={() => signOut()}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                >
                  Sign Out
                </button>
              </div>
            </>
          ) : (
            <Link href="/login" className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition">
              Sign In
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
