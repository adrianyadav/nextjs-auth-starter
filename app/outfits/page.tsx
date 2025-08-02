"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
                    <div className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            ) : (
                <>
                    {outfits.length === 0 ? (
                        <p className="text-muted-foreground">No outfits available.</p>
                    ) : (
                        <ul className="space-y-6 w-full max-w-4xl mx-auto">
                            {outfits.map((outfit) => (
                                <Card key={outfit.id} className="shadow-md">
                                    <CardHeader>
                                        <CardTitle>
                                            <Link href={`/outfits/${outfit.id}`} className="hover:underline">
                                                {outfit.name}
                                            </Link>
                                        </CardTitle>
                                        <CardDescription>
                                            by {outfit.user?.name || "Anonymous"}
                                        </CardDescription>
                                        <p className="text-xs text-muted-foreground">
                                            {new Date(outfit.createdAt).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })}
                                        </p>
                                    </CardHeader>
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
                                </Card>
                            ))}
                        </ul>
                    )}

                    {/* Pagination Controls */}
                    <div className="flex justify-center space-x-4 mt-8">
                        {page > 1 && (
                            <Button asChild variant="outline">
                                <Link href={`/outfits?page=${page - 1}`}>
                                    Previous
                                </Link>
                            </Button>
                        )}
                        {page < totalPages && (
                            <Button asChild variant="outline">
                                <Link href={`/outfits?page=${page + 1}`}>
                                    Next
                                </Link>
                            </Button>
                        )}
                    </div>
                </>
            )}
        </>
    );
}

export default function OutfitsPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-start p-8">
            <Suspense
                fallback={
                    <div className="flex items-center justify-center min-h-screen">
                        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        <p className="ml-3 text-muted-foreground">Loading page...</p>
                    </div>
                }
            >
                <OutfitsList />
            </Suspense>
        </div>
    );
} 