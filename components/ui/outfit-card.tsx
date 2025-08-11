"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Share2, Lock, Eye, Tag, Shirt, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import { AdminDeleteButton } from "@/components/ui/admin-delete-button";
import { useAdmin } from "@/hooks/use-admin";
import { sortItemsByCategory, getCategoryColors } from "@/lib/constants";

interface OutfitItem {
    id: number;
    name: string;
    category: string;
    description?: string;
    purchaseUrl?: string;
    imageUrl?: string;
}

interface OutfitCardProps {
    outfit: {
        id: number;
        name: string;
        description?: string;
        imageUrl?: string;
        tags: string[];
        isPrivate: boolean;
        shareSlug?: string;
        createdAt: string;
        items: OutfitItem[];
        userId?: string; // Add this to track ownership
    };
    showActions?: boolean;
    onShare?: (outfitId: number) => void;
    onDelete?: (outfitId: number) => void;
    sharingOutfit?: number | null;
    deletingOutfit?: number | null;
    className?: string;
    currentUserId?: string; // Add this to check ownership
}

export default function OutfitCard({
    outfit,
    showActions = true,
    onShare,
    onDelete,
    sharingOutfit,
    deletingOutfit,
    className = "",
    currentUserId
}: OutfitCardProps) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const { isAdmin, loading: adminLoading } = useAdmin();

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setShowDeleteDialog(true);
    };

    const handleConfirmDelete = async () => {
        if (onDelete) {
            await onDelete(outfit.id);
            setShowDeleteDialog(false);
        }
    };

    const handleAdminDelete = () => {
        // Refresh the page or trigger a re-fetch of outfits
        window.location.reload();
    };

    // Check if current user owns this outfit
    const isOwner = currentUserId && outfit.userId && currentUserId === outfit.userId;

    return (
        <Link
            href={showDeleteDialog ? "#" : `/outfits/${outfit.id}`}
            className="block"
            data-testid={`outfit-card-${outfit.id}`}
            data-outfit-name={outfit.name}
            onClick={(e) => {
                // Prevent navigation when any action button is clicked
                if (showDeleteDialog || e.target instanceof HTMLButtonElement) {
                    e.preventDefault();
                }
            }}
        >
            <Card className={`group overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-background to-muted/20 border-0 cursor-pointer ${className}`}>
                {/* Image Section */}
                <div className="aspect-square bg-gradient-to-br from-royal/10 to-royal/5 flex items-center justify-center relative overflow-hidden">
                    {outfit.imageUrl ? (
                        <>
                            <Image
                                src={outfit.imageUrl}
                                alt={outfit.name}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                priority={false}
                                // Add these for better image handling:
                                quality={85}
                                placeholder="blur"
                                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxAAPwCdABmX/9k="
                            />

                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center text-royal/60 group-hover:text-royal/80 transition-colors duration-300">
                            <svg className="w-16 h-16 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-sm font-medium">No Image</span>
                        </div>
                    )}

                    {/* Privacy Badge Overlay */}
                    {showActions && (
                        <div className="absolute top-3 right-3 z-10">
                            {outfit.isPrivate ? (
                                <Badge variant="secondary" className="flex items-center gap-1 bg-white/95 backdrop-blur-md border border-royal/30 shadow-xl group-hover:bg-royal/10 group-hover:border-royal/50 group-hover:shadow-2xl transition-all duration-300 text-foreground font-semibold">
                                    <Lock className="h-3 w-3" />
                                    Private
                                </Badge>
                            ) : (
                                <Badge variant="outline" className="flex items-center gap-1 bg-white/95 backdrop-blur-md border-royal/40 shadow-xl group-hover:bg-royal/10 group-hover:border-royal/50 group-hover:shadow-2xl transition-all duration-300 text-foreground font-semibold">
                                    <Eye className="h-3 w-3" />
                                    Public
                                </Badge>
                            )}
                        </div>
                    )}


                </div>

                {/* Content Section */}
                <CardContent className="p-6 relative">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                            <CardTitle className="text-xl mb-2 group-hover:text-royal transition-colors duration-300">
                                {outfit.name}
                            </CardTitle>
                            <CardDescription className="mb-3 flex items-center gap-2 text-sm">
                                {outfit.items.length} item{outfit.items.length !== 1 ? 's' : ''}
                            </CardDescription>
                        </div>

                        {/* Action Buttons */}
                        {showActions && (
                            <div className="flex gap-2">
                                {!outfit.isPrivate && onShare && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        data-testid={`share-button-${outfit.id}`}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            onShare(outfit.id);
                                        }}
                                        disabled={sharingOutfit === outfit.id}
                                        className="border-royal/30 text-royal hover:bg-royal hover:text-white transition-all duration-300 transform hover:scale-105"
                                    >
                                        <Share2 className="h-4 w-4 mr-2" />
                                        {sharingOutfit === outfit.id ? "Sharing..." : "Share"}
                                    </Button>
                                )}
                                {/* Regular delete button - only for owner */}
                                {onDelete && isOwner && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        data-testid={`delete-button-${outfit.id}`}
                                        onClick={handleDeleteClick}
                                        disabled={deletingOutfit === outfit.id}
                                        className="border-destructive/30 text-destructive hover:bg-destructive hover:text-white transition-all duration-300 transform hover:scale-105"
                                    >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        {deletingOutfit === outfit.id ? "Deleting..." : "Delete"}
                                    </Button>
                                )}
                                {/* Admin Delete Button - Only show for public outfits when user is admin */}
                                {!outfit.isPrivate && isAdmin && !adminLoading && (
                                    <AdminDeleteButton
                                        outfitId={outfit.id}
                                        outfitName={outfit.name}
                                        onDelete={handleAdminDelete}
                                    />
                                )}
                            </div>
                        )}
                    </div>

                    {/* Description */}
                    {outfit.description && (
                        <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                            {outfit.description}
                        </p>
                    )}

                    {/* Tags */}
                    {outfit.tags && outfit.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2 w-full">
                                <Tag className="h-3 w-3" />
                                <span>Tags</span>
                            </div>
                            {outfit.tags.map((tag, index) => (
                                <Badge
                                    key={index}
                                    variant="secondary"
                                    className="bg-white/90 text-royal border border-royal/30 hover:bg-royal/20 hover:border-royal/50 transition-all duration-300 transform hover:scale-105 font-medium shadow-sm"
                                    data-testid={`outfit-card-tag-${index}`}
                                >
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    )}

                    {/* Items Preview */}
                    {outfit.items && outfit.items.length > 0 && (
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                <Shirt className="h-4 w-4" />
                                <span>Outfit Details</span>
                            </div>
                            <div className="grid grid-cols-1 gap-2">
                                {sortItemsByCategory(outfit.items).slice(0, 3).map((item) => {
                                    const categoryColors = getCategoryColors(item.category);
                                    return (
                                        <div
                                            key={item.id}
                                            className="text-sm text-muted-foreground flex items-center gap-2 p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors duration-200"
                                        >
                                            {item.imageUrl ? (
                                                <div className="w-8 h-8 rounded-md overflow-hidden bg-muted flex-shrink-0 relative">
                                                    <Image
                                                        src={item.imageUrl}
                                                        alt={item.name}
                                                        fill
                                                        className="object-cover"
                                                        sizes="32px"
                                                    />
                                                </div>
                                            ) : (
                                                <div
                                                    className="w-2 h-2 rounded-full"
                                                    style={{ backgroundColor: categoryColors.primary }}
                                                ></div>
                                            )}
                                            <span className="font-medium text-foreground">
                                                {item.name}
                                            </span>
                                            <span
                                                className="text-xs"
                                                style={{ color: categoryColors.primary }}
                                            >
                                                ({item.category.toLowerCase()})
                                            </span>
                                        </div>
                                    );
                                })}
                                {outfit.items.length > 3 && (
                                    <div className="text-sm text-muted-foreground p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors duration-200">
                                        +{outfit.items.length - 3} more items
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            <ConfirmDialog
                title="Delete Outfit"
                message={`Are you sure you want to delete "${outfit.name}"? This action cannot be undone.`}
                confirmText="Delete Outfit"
                onConfirm={handleConfirmDelete}
                isOpen={showDeleteDialog}
                onClose={() => setShowDeleteDialog(false)}
                isLoading={deletingOutfit === outfit.id}
            />
        </Link>
    );
} 