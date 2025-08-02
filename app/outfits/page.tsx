"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";

interface Outfit {
    id: number;
    name: string;
    description?: string;
    imageUrl?: string;
    tags: string[];
    createdAt: string;
    user?: {
        name: string;
    };
}

// Disable static generation
export const dynamic = "force-dynamic";

function OutfitsList() {
    const searchParams = useSearchParams();
    const page = parseInt(searchParams.get("page") || "1");

    const [outfits, setOutfits] = useState<Outfit[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchOutfits() {
            setIsLoading(true);
            try {
                const res = await fetch(`/api/outfits?page=${page}`);
                if (!res.ok) {
                    throw new Error("Failed to fetch outfits");
                }
                const data = await res.json();
                setOutfits(data.outfits);
                setTotalPages(data.totalPages);
            } catch (error) {
                console.error("Error fetching outfits:", error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchOutfits();
    }, [page]);

    return (
        <>
            {isLoading ? (
                <div className="flex items-center justify-center space-x-2 min-h-[200px]">
                    <div className="w-6 h-6 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            ) : (
                <>
                    {outfits.length === 0 ? (
                        <p className="text-gray-600">No outfits available.</p>
                    ) : (
                        <ul className="space-y-6 w-full max-w-4xl mx-auto">
                            {outfits.map((outfit) => (
                                <li key={outfit.id} className="border p-6 rounded-lg shadow-md bg-white">
                                    <Link href={`/outfits/${outfit.id}`} className="text-2xl font-semibold text-gray-900 hover:underline">
                                        {outfit.name}
                                    </Link>
                                    <p className="text-sm text-gray-500">by {outfit.user?.name || "Anonymous"}</p>
                                    <p className="text-xs text-gray-400">
                                        {new Date(outfit.createdAt).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </p>
                                    {outfit.tags && outfit.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-3">
                                            {outfit.tags.map((tag, index) => (
                                                <span key={index} className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}

                    {/* Pagination Controls */}
                    <div className="flex justify-center space-x-4 mt-8">
                        {page > 1 && (
                            <Link href={`/outfits?page=${page - 1}`}>
                                <button className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Previous</button>
                            </Link>
                        )}
                        {page < totalPages && (
                            <Link href={`/outfits?page=${page + 1}`}>
                                <button className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Next</button>
                            </Link>
                        )}
                    </div>
                </>
            )}
        </>
    );
}

export default function OutfitsPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start p-8">
            <Suspense
                fallback={
                    <div className="flex items-center justify-center min-h-screen">
                        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="ml-3 text-gray-600">Loading page...</p>
                    </div>
                }
            >
                <OutfitsList />
            </Suspense>
        </div>
    );
} 