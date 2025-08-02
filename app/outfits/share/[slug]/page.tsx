import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SharedOutfitPageProps {
    params: {
        slug: string;
    };
}

export default async function SharedOutfitPage({ params }: SharedOutfitPageProps) {
    const outfit = await prisma.outfit.findUnique({
        where: {
            shareSlug: params.slug,
            isPrivate: false, // Only show public outfits
        },
        include: {
            user: {
                select: {
                    name: true,
                },
            },
            items: true,
        },
    });

    if (!outfit) {
        notFound();
    }

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
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
                            <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                                <img
                                    src={outfit.imageUrl}
                                    alt={outfit.name}
                                    className="w-full h-full object-cover"
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

                        {outfit.tags.length > 0 && (
                            <div>
                                <h2 className="text-2xl font-semibold mb-3">Tags</h2>
                                <div className="flex flex-wrap gap-2">
                                    {outfit.tags.map((tag) => (
                                        <Badge key={tag} variant="secondary">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        {outfit.items.length > 0 && (
                            <div>
                                <h2 className="text-2xl font-semibold mb-3">Items</h2>
                                <div className="space-y-4">
                                    {outfit.items.map((item) => (
                                        <Card key={item.id}>
                                            <CardHeader className="pb-2">
                                                <CardTitle className="text-lg">{item.name}</CardTitle>
                                                <CardDescription className="capitalize">
                                                    {item.category.toLowerCase()}
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                {item.description && (
                                                    <p className="text-sm text-muted-foreground mb-2">
                                                        {item.description}
                                                    </p>
                                                )}
                                                {item.purchaseUrl && (
                                                    <a
                                                        href={item.purchaseUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-sm text-blue-600 hover:text-blue-800 underline"
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
                    </div>
                </div>
            </div>
        </div>
    );
} 