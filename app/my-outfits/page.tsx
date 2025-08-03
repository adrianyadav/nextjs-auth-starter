"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import OutfitCard from "@/components/ui/outfit-card";

interface OutfitItem {
    id: number;
    name: string;
    category: string;
    description?: string;
    purchaseUrl?: string;
}

interface Outfit {
    id: number;
    name: string;
    description?: string;
    imageUrl?: string;
    tags: string[];
    isPrivate: boolean;
    shareSlug?: string;
    createdAt: string;
    items: OutfitItem[];
}

// Disable static generation
export const dynamic = "force-dynamic";

function MyOutfitsList() {
    const searchParams = useSearchParams();
    const page = parseInt(searchParams.get("page") || "1");

    const [outfits, setOutfits] = useState<Outfit[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [sharingOutfit, setSharingOutfit] = useState<number | null>(null);

    useEffect(() => {
        async function fetchMyOutfits() {
            setIsLoading(true);
            try {
                const res = await fetch(`/api/my-outfits?page=${page}`);
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

        fetchMyOutfits();
    }, [page]);

    const handleShare = async (outfitId: number) => {
        if (sharingOutfit === outfitId) return;

        setSharingOutfit(outfitId);
        try {
            const response = await fetch(`/api/outfits/${outfitId}/share`, {
                method: "POST",
            });

            if (response.ok) {
                const { shareUrl } = await response.json();
                await navigator.clipboard.writeText(shareUrl);
                alert("Share link copied to clipboard!");
            } else {
                const error = await response.json();
                alert(error.error || "Failed to generate share link");
            }
        } catch (error) {
            console.error("Error sharing outfit:", error);
            alert("Failed to share outfit");
        } finally {
            setSharingOutfit(null);
        }
    };

    return (
        <>
            {isLoading ? (
                <div className="flex items-center justify-center space-x-2 min-h-[200px]">
                    <div className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            ) : (
                <>
                    {outfits.length === 0 ? (
                        <div className="text-center space-y-4">
                            <p className="text-muted-foreground">You haven&apos;t created any outfits yet.</p>
                            <Button asChild>
                                <Link href="/outfits/new">Create Your First Outfit</Link>
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl mx-auto">
                            {outfits.map((outfit) => (
                                <OutfitCard
                                    key={outfit.id}
                                    outfit={outfit}
                                    showActions={true}
                                    onShare={handleShare}
                                    sharingOutfit={sharingOutfit}
                                />
                            ))}
                        </div>
                    )}

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex justify-center space-x-4 mt-8">
                            {page > 1 && (
                                <Button asChild variant="outline">
                                    <Link href={`/my-outfits?page=${page - 1}`}>
                                        Previous
                                    </Link>
                                </Button>
                            )}
                            {page < totalPages && (
                                <Button asChild variant="outline">
                                    <Link href={`/my-outfits?page=${page + 1}`}>
                                        Next
                                    </Link>
                                </Button>
                            )}
                        </div>
                    )}
                </>
            )}
        </>
    );
}

export default function MyOutfitsPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-start p-8">
            <div className="w-full max-w-4xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">My Outfits</h1>
                    <p className="text-muted-foreground">
                        Manage your outfits and share them with others
                    </p>
                </div>

                <div className="flex justify-end mb-6">
                    <Button asChild>
                        <Link href="/outfits/new">Create New Outfit</Link>
                    </Button>
                </div>

                <Suspense
                    fallback={
                        <div className="flex items-center justify-center min-h-[200px]">
                            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                            <p className="ml-3 text-muted-foreground">Loading outfits...</p>
                        </div>
                    }
                >
                    <MyOutfitsList />
                </Suspense>
            </div>
        </div>
    );
} 