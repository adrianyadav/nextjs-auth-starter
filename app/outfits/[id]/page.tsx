"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { use } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import EditOutfitModal from "@/components/ui/edit-outfit-modal";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft } from "lucide-react";
import { sortItemsByCategory, getCategoryColors } from "@/lib/constants";
import { useSession } from "next-auth/react";

interface OutfitItem {
    id: number;
    name: string;
    category: string;
    description?: string;
    purchaseUrl?: string;
    imageUrl?: string;
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
    user?: {
        name: string;
    };
    items: OutfitItem[];
}

export default function OutfitPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { id } = use(params);
    const { data: session } = useSession();
    const [outfit, setOutfit] = useState<Outfit | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isSharing, setIsSharing] = useState(false);
    const [isOwned, setIsOwned] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        async function fetchOutfit() {
            try {
                const res = await fetch(`/api/outfits/${id}`);
                if (!res.ok) {
                    throw new Error("Failed to fetch outfit");
                }
                const data = await res.json();
                setOutfit(data);

                // Check if user owns this outfit
                const sessionRes = await fetch('/api/auth/session');
                if (sessionRes.ok) {
                    const session = await sessionRes.json();
                    setIsOwned(session.user?.id === data.userId);
                }
            } catch (error) {
                console.error("Error fetching outfit:", error);
                router.push("/outfits");
            } finally {
                setIsLoading(false);
            }
        }

        fetchOutfit();
    }, [id, router]);

    const handleSaveOutfit = async () => {
        if (isSaving || !outfit) return;

        setIsSaving(true);
        try {
            const response = await fetch(`/api/outfits/${outfit.id}/save`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                toast({
                    title: "Success",
                    description: "Outfit saved successfully!",
                });
                router.push("/my-outfits");
            } else {
                const errorData = await response.json();
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: errorData.error || "Failed to save outfit",
                });
            }
        } catch (err) {
            console.error("Error saving outfit:", err);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to save outfit. Please try again later.",
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handleOutfitUpdated = (updatedOutfit: Outfit) => {
        setOutfit(updatedOutfit);
    };

    const handleShare = async () => {
        if (isSharing || !outfit) return;

        setIsSharing(true);
        try {
            const response = await fetch(`/api/outfits/${outfit.id}/share`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                const { shareUrl } = await response.json();

                // Copy to clipboard
                await navigator.clipboard.writeText(shareUrl);

                toast({
                    title: "Share link copied!",
                    description: "The share link has been copied to your clipboard.",
                });
            } else {
                const errorData = await response.json();
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: errorData.error || "Failed to generate share link",
                });
            }
        } catch (err) {
            console.error("Error sharing outfit:", err);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to generate share link. Please try again later.",
            });
        } finally {
            setIsSharing(false);
        }
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div data-testid="loading-spinner" className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
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
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header with actions */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <Button asChild variant="outline" className="w-fit">
                            <Link href="/my-outfits" className="flex items-center gap-2">
                                <ArrowLeft className="h-4 w-4" />
                                Back
                            </Link>
                        </Button>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2">
                            {isOwned ? (
                                <>
                                    <EditOutfitModal
                                        outfit={outfit}
                                        onOutfitUpdated={handleOutfitUpdated}
                                    />
                                    {!outfit.isPrivate && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleShare}
                                            disabled={isSharing}
                                            className="border-royal/30 text-royal hover:bg-royal hover:text-white transition-all duration-300 h-9"
                                            data-testid="share-outfit-button"
                                        >
                                            {isSharing ? "Sharing..." : "Share"}
                                        </Button>
                                    )}
                                </>
                            ) : (
                                <>
                                    {!outfit.isPrivate && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleShare}
                                            disabled={isSharing}
                                            className="border-royal/30 text-royal hover:bg-royal hover:text-white transition-all duration-300 h-9"
                                            data-testid="share-outfit-button"
                                        >
                                            {isSharing ? "Sharing..." : "Share"}
                                        </Button>
                                    )}
                                    {!outfit.isPrivate && session && (
                                        <Button
                                            variant="default"
                                            size="sm"
                                            onClick={handleSaveOutfit}
                                            disabled={isSaving}
                                            className="bg-royal hover:bg-royal/90 flex items-center gap-2 h-9"
                                            data-testid="save-to-my-outfits-button"
                                        >
                                            {isSaving ? "Saving..." : "Save"}
                                        </Button>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    <h1 className="text-4xl font-bold mb-2">{outfit.name}</h1>
                    {outfit.user?.name && (
                        <p className="text-muted-foreground">
                            Created by {outfit.user.name}
                        </p>
                    )}
                    <p className="text-sm text-muted-foreground">
                        {formatDate(outfit.createdAt)}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Outfit Image */}
                    {outfit.imageUrl && (
                        <div className="space-y-4">
                            <h2 className="text-2xl font-semibold">Outfit</h2>
                            <div className="relative rounded-lg overflow-hidden">
                                <Image
                                    src={outfit.imageUrl}
                                    alt={outfit.name}
                                    width={600}
                                    height={600}
                                    className="object-contain max-h-[600px] w-auto"
                                    sizes="(max-width: 768px) 100vw, 600px"
                                    priority={true}
                                    quality={85}
                                    placeholder="blur"
                                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                                />
                            </div>
                        </div>
                    )}

                    {/* Outfit Details */}
                    <div className="space-y-6">
                        {outfit.description && (
                            <div>
                                <h2 className="text-2xl font-semibold mb-3">Description</h2>
                                <p className="text-muted-foreground">{outfit.description}</p>
                            </div>
                        )}

                        {outfit.tags && outfit.tags.length > 0 && (
                            <div>
                                <h2 className="text-2xl font-semibold mb-3">Tags</h2>
                                <div className="flex flex-wrap gap-2">
                                    {outfit.tags.map((tag, index) => (
                                        <Badge key={index} variant="secondary">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        {outfit.items && outfit.items.length > 0 && (
                            <div>
                                <h2 className="text-2xl font-semibold mb-3">Items</h2>
                                <div className="space-y-4">
                                    {sortItemsByCategory(outfit.items).map((item) => {
                                        const categoryColors = getCategoryColors(item.category);
                                        return (
                                            <Card key={item.id} data-testid={`outfit-item-${item.id}`}>
                                                <CardHeader className="pb-2">
                                                    <CardTitle className="text-lg" data-testid={`outfit-item-name-${item.id}`}>
                                                        {item.name}
                                                    </CardTitle>
                                                    <CardDescription
                                                        className="capitalize"
                                                        data-testid={`outfit-item-category-${item.id}`}
                                                        style={{ color: categoryColors.primary }}
                                                    >
                                                        {item.category.toLowerCase().replace('_', ' ')}
                                                    </CardDescription>
                                                </CardHeader>
                                                <CardContent>
                                                    {item.imageUrl && (
                                                        <div className="mb-3">
                                                            <div className="aspect-square w-full max-w-48 rounded-lg overflow-hidden bg-muted relative">
                                                                <Image
                                                                    src={item.imageUrl}
                                                                    alt={item.name}
                                                                    fill
                                                                    className="object-cover"
                                                                    sizes="(max-width: 768px) 100vw, 192px"
                                                                />
                                                            </div>
                                                        </div>
                                                    )}
                                                    {item.description && (
                                                        <p className="text-sm text-muted-foreground mb-2" data-testid={`outfit-item-description-${item.id}`}>
                                                            {item.description}
                                                        </p>
                                                    )}
                                                    {item.purchaseUrl && (
                                                        <a
                                                            href={item.purchaseUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-sm text-royal hover:underline"
                                                        >
                                                            View Item →
                                                        </a>
                                                    )}
                                                </CardContent>
                                            </Card>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
} 