"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Share2, Lock, Eye } from "lucide-react";

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
                        <ul className="space-y-6 w-full max-w-4xl mx-auto">
                            {outfits.map((outfit) => (
                                <Card key={outfit.id} className="shadow-md">
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <CardTitle>
                                                    <Link href={`/outfits/${outfit.id}`} className="hover:underline">
                                                        {outfit.name}
                                                    </Link>
                                                </CardTitle>
                                                <CardDescription>
                                                    {new Date(outfit.createdAt).toLocaleDateString("en-US", {
                                                        year: "numeric",
                                                        month: "long",
                                                        day: "numeric",
                                                    })}
                                                </CardDescription>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                {outfit.isPrivate ? (
                                                    <Badge variant="secondary" className="flex items-center gap-1">
                                                        <Lock className="h-3 w-3" />
                                                        Private
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="outline" className="flex items-center gap-1">
                                                        <Eye className="h-3 w-3" />
                                                        Public
                                                    </Badge>
                                                )}
                                                {!outfit.isPrivate && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleShare(outfit.id)}
                                                        disabled={sharingOutfit === outfit.id}
                                                    >
                                                        <Share2 className="h-4 w-4 mr-2" />
                                                        {sharingOutfit === outfit.id ? "Sharing..." : "Share"}
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </CardHeader>

                                    {outfit.description && (
                                        <CardContent className="pt-0">
                                            <p className="text-sm text-muted-foreground mb-3">
                                                {outfit.description}
                                            </p>
                                        </CardContent>
                                    )}

                                    {outfit.tags && outfit.tags.length > 0 && (
                                        <CardContent className="pt-0">
                                            <div className="flex flex-wrap gap-2">
                                                {outfit.tags.map((tag, index) => (
                                                    <Badge key={index} variant="secondary">
                                                        {tag}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </CardContent>
                                    )}

                                    {outfit.items && outfit.items.length > 0 && (
                                        <CardContent className="pt-0">
                                            <div className="space-y-2">
                                                <h4 className="text-sm font-medium">Items ({outfit.items.length})</h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                    {outfit.items.slice(0, 4).map((item) => (
                                                        <div key={item.id} className="text-sm text-muted-foreground">
                                                            • {item.name} ({item.category.toLowerCase()})
                                                        </div>
                                                    ))}
                                                    {outfit.items.length > 4 && (
                                                        <div className="text-sm text-muted-foreground">
                                                            +{outfit.items.length - 4} more items
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    )}
                                </Card>
                            ))}
                        </ul>
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