"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Edit } from "lucide-react";
import EditOutfitForm from "./edit-outfit-form";
import { useToast } from "@/components/ui/use-toast";

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

interface EditOutfitModalProps {
    outfit: Outfit;
    onOutfitUpdated: (updatedOutfit: Outfit) => void;
}

export default function EditOutfitModal({ outfit, onOutfitUpdated }: EditOutfitModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleSave = async (updatedOutfit: Outfit) => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/outfits/${outfit.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    name: updatedOutfit.name,
                    description: updatedOutfit.description,
                    imageUrl: updatedOutfit.imageUrl,
                    tags: updatedOutfit.tags,
                    isPrivate: updatedOutfit.isPrivate,
                    items: updatedOutfit.items,
                }),
            });

            if (response.ok) {
                const savedOutfit = await response.json();
                onOutfitUpdated(savedOutfit);
                setIsOpen(false);
                toast({
                    title: "Success",
                    description: "Outfit updated successfully!",
                });
            } else {
                const errorData = await response.json();
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: errorData.error || "Failed to update outfit",
                });
            }
        } catch (error) {
            console.error("Error updating outfit:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to update outfit. Please try again.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    className="flex items-center gap-2"
                    data-testid="edit-outfit-button"
                >
                    <Edit className="h-4 w-4" />
                    Edit
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Outfit</DialogTitle>
                </DialogHeader>
                <EditOutfitForm
                    outfit={outfit}
                    onSave={handleSave}
                    onCancel={handleCancel}
                    isLoading={isLoading}
                />
            </DialogContent>
        </Dialog>
    );
} 