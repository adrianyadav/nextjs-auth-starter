"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import OutfitCard from "@/components/ui/outfit-card";
import { TShirtIcon } from '@/components/ui/tshirt-icon';
import { useAdmin } from "@/hooks/use-admin";
import { useSession } from "next-auth/react";

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
    createdAt: string;
    user?: {
        name: string;
    };
    items?: OutfitItem[];
}

// Disable static generation
export const dynamic = "force-dynamic";

function OutfitsList() {
    const searchParams = useSearchParams();
    const page = parseInt(searchParams.get("page") || "1");
    const { isAdmin, loading: adminLoading } = useAdmin();
    const { data: session } = useSession();

    const [outfits, setOutfits] = useState<Outfit[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(true);

    const fetchOutfits = useCallback(async () => {
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
    }, [page]);

    useEffect(() => {
        fetchOutfits();
    }, [fetchOutfits]);

    const handleAdminDelete = () => {
        // Re-fetch the outfits list after admin delete
        fetchOutfits();
    };

    return (
        <>
            {isLoading ? (
                <div className="flex items-center justify-center space-x-2 min-h-[200px]">
                    <div data-testid="loading-spinner" className="w-6 h-6 border-4 border-royal border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            ) : (
                <>
                    {outfits.length === 0 ? (
                        <div className="text-center space-y-6 py-12">
                            <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <TShirtIcon className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-xl font-semibold text-foreground font-raleway">No outfits available</h3>
                            <p className="text-muted-foreground max-w-md mx-auto">
                                Be the first to share your style! Create and share your outfits with the community.
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
                                        outfit={{
                                            ...outfit,
                                            isPrivate: false,
                                            items: outfit.items || []
                                        }}
                                        showActions={isAdmin && !adminLoading}
                                        onDelete={handleAdminDelete}
                                        currentUserId={session?.user?.id}
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
                                    <Link href={`/outfits?page=${page - 1}`} className="flex items-center gap-2">
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
                                    <Link href={`/outfits?page=${page + 1}`} className="flex items-center gap-2">
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

export default function OutfitsPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header Section */}
                <div className="mb-12">
                    <h1 className="text-5xl md:text-6xl font-black text-foreground mb-6 leading-tight font-raleway">
                        Browse <span className="text-gradient-royal">Outfits</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
                        Discover amazing styles from our fashion community. Get inspired and find your next favorite look.
                    </p>
                </div>

                <Suspense
                    fallback={
                        <div className="flex items-center justify-center min-h-[200px]">
                            <div className="w-10 h-10 border-4 border-royal border-t-transparent rounded-full animate-spin"></div>
                            <p className="ml-3 text-muted-foreground">Loading outfits...</p>
                        </div>
                    }
                >
                    <OutfitsList />
                </Suspense>
            </div>
        </div>
    );
}