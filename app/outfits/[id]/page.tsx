"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { use } from "react";
import Link from "next/link";
import Image from "next/image";

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
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="ml-3 text-gray-600">Loading outfit...</p>
            </div>
        );
    }

    if (!outfit) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-gray-600">Outfit not found.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start p-8">
            <div className="w-full max-w-4xl">
                <div className="bg-white shadow-md rounded-lg p-8">
                    <div className="flex justify-between items-start mb-6">
                        <h1 className="text-4xl font-bold text-gray-900">{outfit.name}</h1>
                        <Link
                            href="/outfits"
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                        >
                            Back to Outfits
                        </Link>
                    </div>

                    {outfit.imageUrl && (
                        <div className="mb-6">
                            <Image
                                src={outfit.imageUrl}
                                alt={outfit.name}
                                width={800}
                                height={600}
                                className="w-full max-w-2xl rounded-lg shadow-md"
                            />
                        </div>
                    )}

                    <div className="mb-6">
                        <p className="text-sm text-gray-500">by {outfit.user?.name || "Anonymous"}</p>
                        <p className="text-xs text-gray-400">
                            {new Date(outfit.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </p>
                    </div>

                    {outfit.description && (
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">Description</h2>
                            <p className="text-gray-700 leading-relaxed">{outfit.description}</p>
                        </div>
                    )}

                    {outfit.tags && outfit.tags.length > 0 && (
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">Tags</h2>
                            <div className="flex flex-wrap gap-2">
                                {outfit.tags.map((tag, index) => (
                                    <span key={index} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 