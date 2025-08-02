"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { use } from "react";
import Link from "next/link";
import Image from "next/image";
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

export default function OutfitPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { id } = use(params);
    const [outfit, setOutfit] = useState<Outfit | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchOutfit() {
            try {
                const res = await fetch(`/api/outfits/${id}`);
                if (!res.ok) {
                    throw new Error("Failed to fetch outfit");
                }
                const data = await res.json();
                setOutfit(data);
            } catch (error) {
                console.error("Error fetching outfit:", error);
                router.push("/outfits");
            } finally {
                setIsLoading(false);
            }
        }

        fetchOutfit();
    }, [id, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="ml-3 text-muted-foreground">Loading outfit...</p>
            </div>
        );
    }

    if (!outfit) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <p className="text-muted-foreground">Outfit not found.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-start p-8">
            <div className="w-full max-w-4xl">
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <CardTitle className="text-4xl">{outfit.name}</CardTitle>
                            <Button asChild variant="outline">
                                <Link href="/outfits">
                                    Back to Outfits
                                </Link>
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {outfit.imageUrl && (
                            <div>
                                <Image
                                    src={outfit.imageUrl}
                                    alt={outfit.name}
                                    width={800}
                                    height={600}
                                    className="w-full max-w-2xl rounded-lg shadow-md"
                                />
                            </div>
                        )}

                        <div>
                            <CardDescription>by {outfit.user?.name || "Anonymous"}</CardDescription>
                            <p className="text-xs text-muted-foreground">
                                {new Date(outfit.createdAt).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </p>
                        </div>

                        {outfit.description && (
                            <div>
                                <h2 className="text-xl font-semibold text-foreground mb-2">Description</h2>
                                <p className="text-muted-foreground leading-relaxed">{outfit.description}</p>
                            </div>
                        )}

                        {outfit.tags && outfit.tags.length > 0 && (
                            <div>
                                <h2 className="text-xl font-semibold text-foreground mb-2">Tags</h2>
                                <div className="flex flex-wrap gap-2">
                                    {outfit.tags.map((tag, index) => (
                                        <Badge key={index} variant="secondary">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
} 