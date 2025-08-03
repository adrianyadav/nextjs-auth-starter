import Link from "next/link";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Share2, Lock, Eye, Calendar, Tag, Shirt } from "lucide-react";
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
        <Link href={`/outfits/${outfit.id}`} className="block">
            <Card className={`group overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-background to-muted/20 border-0 cursor-pointer ${className}`}>
                {/* Image Section */}
                <div className="aspect-square bg-gradient-to-br from-royal/10 to-royal/5 flex items-center justify-center relative overflow-hidden">
                    {outfit.imageUrl ? (
                        <>
                            <img
                                src={outfit.imageUrl}
                                alt={outfit.name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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
                        <div className="absolute top-3 right-3">
                            {outfit.isPrivate ? (
                                <Badge variant="secondary" className="flex items-center gap-1 bg-background/90 backdrop-blur-sm border border-royal/20 shadow-lg group-hover:bg-royal group-hover:text-white transition-all duration-300 text-foreground">
                                    <Lock className="h-3 w-3" />
                                    Private
                                </Badge>
                            ) : (
                                <Badge variant="outline" className="flex items-center gap-1 bg-background/90 backdrop-blur-sm border-royal/30 shadow-lg group-hover:bg-royal group-hover:text-white group-hover:border-royal transition-all duration-300 text-foreground">
                                    <Eye className="h-3 w-3" />
                                    Public
                                </Badge>
                            )}
                        </div>
                    )}

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-royal/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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

                        {/* Share Button */}
                        {showActions && !outfit.isPrivate && onShare && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onShare(outfit.id);
                                }}
                                disabled={sharingOutfit === outfit.id}
                                className="ml-2 border-royal/30 text-royal hover:bg-royal hover:text-white transition-all duration-300 transform hover:scale-105"
                            >
                                <Share2 className="h-4 w-4 mr-2" />
                                {sharingOutfit === outfit.id ? "Sharing..." : "Share"}
                            </Button>
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
                                    className="bg-royal/10 text-royal border border-royal/20 hover:bg-royal hover:text-royal-foreground transition-all duration-300 transform hover:scale-105"
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
                                {outfit.items.slice(0, 3).map((item) => (
                                    <div key={item.id} className="text-sm text-muted-foreground flex items-center gap-2 p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors duration-200">
                                        <div className="w-2 h-2 bg-royal/60 rounded-full"></div>
                                        <span className="font-medium">{item.name}</span>
                                        <span className="text-xs text-muted-foreground">({item.category.toLowerCase()})</span>
                                    </div>
                                ))}
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
        </Link>
    );
} 