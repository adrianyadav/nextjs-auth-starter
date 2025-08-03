"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import OutfitCard from "@/components/ui/outfit-card";
import { TShirtIcon } from '@/components/ui/tshirt-icon';

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
                    <div className="w-6 h-6 border-4 border-royal border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            ) : (
                <>
                    {outfits.length === 0 ? (
                        <div className="text-center space-y-6 py-12">
                            <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <TShirtIcon className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-xl font-semibold text-foreground">No outfits yet</h3>
                            <p className="text-muted-foreground max-w-md mx-auto">
                                You haven&apos;t created any outfits yet. Start building your fashion collection!
                            </p>
                            <Button asChild className="bg-gradient-royal hover:bg-gradient-royal-light text-white transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg">
                                <Link href="/outfits/new" className="flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Create Your First Outfit
                                </Link>
                            </Button>
                        </div>
                    ) : (
                        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                            {outfits.map((outfit, index) => (
                                <div key={outfit.id} className={`break-inside-avoid ${index % 2 === 0 ? 'lg:mt-0' : 'lg:mt-8'}`}>
                                    <OutfitCard
                                        outfit={outfit}
                                        showActions={true}
                                        onShare={handleShare}
                                        sharingOutfit={sharingOutfit}
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex justify-center space-x-4 mt-12">
                            {page > 1 && (
                                <Button asChild variant="outline" className="border-royal/30 text-royal hover:bg-royal hover:text-white transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md">
                                    <Link href={`/my-outfits?page=${page - 1}`} className="flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                        Previous
                                    </Link>
                                </Button>
                            )}
                            <div className="flex items-center px-4 py-2 bg-muted/50 rounded-lg border border-border/50">
                                <span className="text-sm text-muted-foreground">
                                    Page {page} of {totalPages}
                                </span>
                            </div>
                            {page < totalPages && (
                                <Button asChild variant="outline" className="border-royal/30 text-royal hover:bg-royal hover:text-white transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md">
                                    <Link href={`/my-outfits?page=${page + 1}`} className="flex items-center gap-2">
                                        Next
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
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
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header Section */}
                <div className="mb-12">
                    <h1 className="text-5xl md:text-6xl font-black text-foreground mb-6 leading-tight">
                        My <span className="text-gradient-royal">Outfits</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
                        Manage your outfits, organize your style, and share your fashion journey with others
                    </p>
                </div>

                {/* Action Bar */}
                <div className="mb-12">
                    <Button asChild size="lg" className="text-lg px-8 py-6 bg-gradient-royal hover:bg-gradient-royal-light shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-white">
                        <Link href="/outfits/new" className="flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Create New Outfit
                        </Link>
                    </Button>
                </div>

                <Suspense
                    fallback={
                        <div className="flex items-center justify-center min-h-[200px]">
                            <div className="w-10 h-10 border-4 border-royal border-t-transparent rounded-full animate-spin"></div>
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