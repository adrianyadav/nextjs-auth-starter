"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import ImageUpload from "@/components/ui/image-upload";
import { Plus, PersonStanding, Clock } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { InputField, TextareaField } from "@/components/ui/form-fields";
import { OutfitItemCard } from "@/components/ui/outfit-item-card";
import { useOutfitItems } from "@/hooks/use-outfit-items";

interface OutfitItem {
    id: number;
    name: string;
    category: string;
    description?: string;
    purchaseUrl?: string;
}

interface PreviousItem {
    name: string;
    category: string;
    description: string;
    purchaseUrl: string;
    usageCount: number;
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

interface EditOutfitFormProps {
    outfit: Outfit;
    onSave: (updatedOutfit: Outfit) => void;
    onCancel: () => void;
    isLoading?: boolean;
}

export default function EditOutfitForm({ outfit, onSave, onCancel, isLoading = false }: EditOutfitFormProps) {
    const [formData, setFormData] = useState({
        name: outfit.name,
        description: outfit.description || "",
        imageUrl: outfit.imageUrl || "",
        tags: outfit.tags.join(", "),
        isPrivate: outfit.isPrivate,
    });
    const [previousItems, setPreviousItems] = useState<PreviousItem[]>([]);
    const [showQuickAdd, setShowQuickAdd] = useState(false);
    const [isLoadingPreviousItems, setIsLoadingPreviousItems] = useState(false);
    const { toast } = useToast();

    // Use the custom hook for item management with initial items
    const initialItems = outfit.items.map(item => ({
        id: item.id,
        name: item.name,
        category: item.category,
        description: item.description || "",
        purchaseUrl: item.purchaseUrl || "",
    }));
    const { items, addItem, removeItem, updateItem, addItemFromPrevious } = useOutfitItems(initialItems);

    // Fetch previous items on component mount
    useEffect(() => {
        fetchPreviousItems();
    }, []);

    const fetchPreviousItems = async () => {
        setIsLoadingPreviousItems(true);
        try {
            const response = await fetch("/api/my-items");
            if (response.ok) {
                const data = await response.json();
                setPreviousItems(data);
            }
        } catch (error) {
            console.error("Error fetching previous items:", error);
        } finally {
            setIsLoadingPreviousItems(false);
        }
    };

    const handleAddItemFromPrevious = (previousItem: PreviousItem) => {
        addItemFromPrevious(previousItem);
        setShowQuickAdd(false);
        toast({
            title: "Item added",
            description: `${previousItem.name} has been added to your outfit.`,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate required fields
        if (!formData.name.trim()) {
            toast({
                title: "Missing outfit name",
                description: "Please enter an outfit name.",
            });
            return;
        }

        if (!formData.imageUrl?.trim()) {
            toast({
                title: "Missing image",
                description: "Please upload an image or provide an image URL.",
            });
            return;
        }

        try {
            const tags = formData.tags.split(",").map(tag => tag.trim()).filter(tag => tag.length > 0);
            const validItems = items
                .filter(item => item.name && item.category)
                .map(item => ({
                    ...item,
                    id: item.id || 0, // Ensure id is always a number
                }));

            const updatedOutfit = {
                ...outfit,
                name: formData.name,
                description: formData.description,
                imageUrl: formData.imageUrl,
                tags,
                isPrivate: formData.isPrivate,
                items: validItems,
            };

            onSave(updatedOutfit);
        } catch (error) {
            console.error("Error updating outfit:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to update outfit. Please try again.",
            });
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleCheckboxChange = (checked: boolean) => {
        setFormData(prev => ({ ...prev, isPrivate: checked }));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6" data-testid="edit-outfit-form">
            <div className="space-y-4">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-gradient-royal rounded-lg flex items-center justify-center">
                        <PersonStanding className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground">Basic Information</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                        label="Outfit Name"
                        required
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter outfit name"
                        testId="edit-outfit-name-input"
                    />

                    <InputField
                        label="Tags (comma-separated)"
                        id="tags"
                        name="tags"
                        value={formData.tags}
                        onChange={handleChange}
                        placeholder="casual, summer, formal"
                        testId="edit-outfit-tags-input"
                    />
                </div>

                <TextareaField
                    label="Description"
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe your outfit..."
                    testId="edit-outfit-description-textarea"
                />

                <div className="space-y-3">
                    <label className="text-sm font-semibold text-foreground">Outfit Image *</label>
                    <ImageUpload
                        currentImageUrl={formData.imageUrl}
                        onImageUpload={(url: string) => setFormData(prev => ({ ...prev, imageUrl: url }))}
                        data-testid="edit-outfit-image-upload"
                    />
                </div>

                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="isPrivate"
                        checked={formData.isPrivate}
                        onCheckedChange={handleCheckboxChange}
                        data-testid="edit-outfit-private-checkbox"
                    />
                    <label htmlFor="isPrivate" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Make this outfit private
                    </label>
                </div>
            </div>

            {/* Outfit Items */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-royal rounded-lg flex items-center justify-center">
                            <Plus className="w-4 h-4 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-foreground">Outfit Items</h3>
                    </div>
                    <div className="flex gap-3">
                        {previousItems.length > 0 && (
                            <Button
                                type="button"
                                variant="outline"
                                size="lg"
                                onClick={() => setShowQuickAdd(!showQuickAdd)}
                                className="border-2 border-royal/30 text-royal hover:bg-royal hover:text-royal-foreground transition-all duration-300"
                                data-testid="edit-quick-add-button"
                                disabled={isLoadingPreviousItems}
                            >
                                <Clock className="h-5 w-5 mr-2" />
                                {isLoadingPreviousItems ? "Loading..." : "Quick Add"}
                            </Button>
                        )}
                        <Button
                            type="button"
                            variant="outline"
                            size="lg"
                            onClick={addItem}
                            className="border-2 border-royal/30 text-royal hover:bg-royal hover:text-royal-foreground transition-all duration-300"
                            data-testid="edit-add-item-button"
                        >
                            <Plus className="h-5 w-5 mr-2" />
                            Add Item
                        </Button>
                    </div>
                </div>

                {/* Quick Add Dropdown */}
                {showQuickAdd && previousItems.length > 0 && (
                    <Card className="p-4 border-2 border-royal/20 bg-card/50 shadow-lg" data-testid="edit-quick-add-dropdown">
                        <CardDescription className="mb-3 text-foreground font-medium">
                            Click on an item to add it to your outfit:
                        </CardDescription>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {previousItems.map((item, index) => (
                                <Button
                                    key={index}
                                    type="button"
                                    variant="ghost"
                                    onClick={() => handleAddItemFromPrevious(item)}
                                    className="justify-start text-left p-3 h-auto border border-border/50 hover:border-royal/50 hover:bg-royal/10 transition-all"
                                    data-testid={`edit-quick-add-item-${index}`}
                                >
                                    <div className="flex flex-col items-start">
                                        <span className="font-medium text-foreground">{item.name}</span>
                                        <span className="text-xs text-muted-foreground">
                                            {item.category}
                                        </span>
                                        <span className="text-xs text-royal">
                                            Used {item.usageCount} time{item.usageCount !== 1 ? 's' : ''}
                                        </span>
                                    </div>
                                </Button>
                            ))}
                        </div>
                    </Card>
                )}

                {items.map((item, index) => (
                    <OutfitItemCard
                        key={item.id || index}
                        item={item}
                        index={index}
                        onUpdate={updateItem}
                        onRemove={removeItem}
                        testIdPrefix="edit-item"
                    />
                ))}
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t border-border/50">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    className="px-6 py-2 border-2 border-border/50 hover:border-royal/30 text-foreground hover:text-royal transition-all duration-300"
                    data-testid="edit-outfit-cancel-button"
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-2 bg-gradient-royal hover:bg-gradient-royal-light text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    data-testid="save-edit-button"
                >
                    {isLoading ? "Saving..." : "Save Changes"}
                </Button>
            </div>
        </form>
    );
} 