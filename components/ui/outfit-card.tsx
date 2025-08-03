import Link from "next/link";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Share2, Lock, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OutfitItem {
    id: number;
    name: string;
    category: string;
    description?: string;
    purchaseUrl?: string;
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
    };
    showActions?: boolean;
    onShare?: (outfitId: number) => void;
    sharingOutfit?: number | null;
    className?: string;
}

export default function OutfitCard({
    outfit,
    showActions = true,
    onShare,
    sharingOutfit,
    className = ""
}: OutfitCardProps) {
    return (
        <Card className={`overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-200 ${className}`}>
            {/* Image Section */}
            <div className="aspect-square bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center relative">
                {outfit.imageUrl ? (
                    <img
                        src={outfit.imageUrl}
                        alt={outfit.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <svg className="w-16 h-16 text-primary/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                )}

                {/* Privacy Badge Overlay */}
                {showActions && (
                    <div className="absolute top-3 right-3">
                        {outfit.isPrivate ? (
                            <Badge variant="secondary" className="flex items-center gap-1 bg-background/80 backdrop-blur-sm">
                                <Lock className="h-3 w-3" />
                                Private
                            </Badge>
                        ) : (
                            <Badge variant="outline" className="flex items-center gap-1 bg-background/80 backdrop-blur-sm">
                                <Eye className="h-3 w-3" />
                                Public
                            </Badge>
                        )}
                    </div>
                )}
            </div>

            {/* Content Section */}
            <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                        <CardTitle className="text-xl mb-2">
                            <Link href={`/outfits/${outfit.id}`} className="hover:underline">
                                {outfit.name}
                            </Link>
                        </CardTitle>
                        <CardDescription className="mb-3">
                            {new Date(outfit.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </CardDescription>
                    </div>

                    {/* Share Button */}
                    {showActions && !outfit.isPrivate && onShare && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onShare(outfit.id)}
                            disabled={sharingOutfit === outfit.id}
                            className="ml-2"
                        >
                            <Share2 className="h-4 w-4 mr-2" />
                            {sharingOutfit === outfit.id ? "Sharing..." : "Share"}
                        </Button>
                    )}
                </div>

                {/* Description */}
                {outfit.description && (
                    <p className="text-muted-foreground text-sm mb-4">
                        {outfit.description}
                    </p>
                )}

                {/* Tags */}
                {outfit.tags && outfit.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {outfit.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary">
                                {tag}
                            </Badge>
                        ))}
                    </div>
                )}

                {/* Items Preview */}
                {outfit.items && outfit.items.length > 0 && (
                    <div className="space-y-2">
                        <h4 className="text-sm font-medium text-muted-foreground">
                            Items ({outfit.items.length})
                        </h4>
                        <div className="grid grid-cols-1 gap-1">
                            {outfit.items.slice(0, 3).map((item) => (
                                <div key={item.id} className="text-sm text-muted-foreground">
                                    • {item.name} ({item.category.toLowerCase()})
                                </div>
                            ))}
                            {outfit.items.length > 3 && (
                                <div className="text-sm text-muted-foreground">
                                    +{outfit.items.length - 3} more items
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
} 