"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { use } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import EditOutfitModal from "@/components/ui/edit-outfit-modal";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Trash2 } from "lucide-react";

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
    user?: {
        name: string;
    };
    items: OutfitItem[];
}

export default function OutfitPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { id } = use(params);
    const [outfit, setOutfit] = useState<Outfit | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
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

    const handleDelete = async () => {
        if (isDeleting || !outfit) return;

        setIsDeleting(true);
        try {
            const response = await fetch(`/api/outfits/${outfit.id}`, {
                method: "DELETE",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                // Redirect to my-outfits page after successful deletion
                console.log("Deletion successful, redirecting to /my-outfits");
                toast({
                    title: "Success",
                    description: "Outfit deleted successfully!",
                });
                // Try multiple redirect methods
                try {
                    router.push("/my-outfits");
                } catch {
                    console.log("Router failed, using window.location");
                    window.location.href = "/my-outfits";
                }
            } else {
                const errorData = await response.json();
                console.error("Delete failed:", errorData);
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: errorData.error || "Failed to delete outfit",
                });
            }
        } catch (err) {
            console.error("Error deleting outfit:", err);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to delete outfit. Please try again later.",
            });
        } finally {
            setIsDeleting(false);
            setShowDeleteDialog(false);
        }
    };

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
        <div className="min-h-screen bg-background flex flex-col items-center justify-start p-8">
            <div className="w-full max-w-4xl">
                <Card>
                    <CardHeader>
                        {/* Action buttons container */}
                        <div className="flex items-center justify-between mb-4">
                            <Button asChild variant="outline" className="w-fit">
                                <Link href="/my-outfits" className="flex items-center gap-2">
                                    <ArrowLeft className="h-4 w-4" />
                                    Back
                                </Link>
                            </Button>

                            {/* Edit/Delete actions */}
                            <div className="flex items-center gap-2">
                                {isOwned ? (
                                    <>
                                        <EditOutfitModal
                                            outfit={outfit}
                                            onOutfitUpdated={handleOutfitUpdated}
                                        />
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => setShowDeleteDialog(true)}
                                            disabled={isDeleting}
                                            className="bg-destructive/90 backdrop-blur-sm flex items-center gap-2 h-9"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            {isDeleting ? "Deleting..." : "Delete"}
                                        </Button>
                                    </>
                                ) : (
                                    !outfit.isPrivate && (
                                        <Button
                                            variant="default"
                                            size="sm"
                                            onClick={handleSaveOutfit}
                                            disabled={isSaving}
                                            className="bg-royal hover:bg-royal/90 flex items-center gap-2 h-9"
                                        >
                                            {isSaving ? "Saving..." : "Save"}
                                        </Button>
                                    )
                                )}
                            </div>
                        </div>

                        <CardTitle className="text-4xl">{outfit.name}</CardTitle>
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

                        {outfit.items && outfit.items.length > 0 && (
                            <div>
                                <h2 className="text-xl font-semibold text-foreground mb-2">Items</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {outfit.items.map((item) => (
                                        <Card key={item.id} data-testid={`outfit-item-${item.id}`}>
                                            <CardHeader className="pb-2">
                                                <CardTitle className="text-lg" data-testid={`outfit-item-name-${item.id}`}>
                                                    {item.name}
                                                </CardTitle>
                                                <CardDescription className="capitalize" data-testid={`outfit-item-category-${item.id}`}>
                                                    {item.category.toLowerCase()}
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent>
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
                                                        className="text-sm text-blue-600 hover:text-blue-800 underline"
                                                        data-testid={`outfit-item-purchase-url-${item.id}`}
                                                    >
                                                        View Purchase Link →
                                                    </a>
                                                )}
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <ConfirmDialog
                title="Delete Outfit"
                message={`Are you sure you want to delete "${outfit?.name}"? This action cannot be undone.`}
                confirmText="Delete Outfit"
                onConfirm={handleDelete}
                isOpen={showDeleteDialog}
                onClose={() => setShowDeleteDialog(false)}
                isLoading={isDeleting}
            />
        </div>
    );
} 