"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import ImageUpload from "@/components/ui/image-upload";
import { Plus, X, PersonStanding } from "lucide-react";
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
    const [items, setItems] = useState<OutfitItem[]>(outfit.items.map(item => ({
        id: item.id,
        name: item.name,
        category: item.category,
        description: item.description || "",
        purchaseUrl: item.purchaseUrl || "",
    })));
    const { toast } = useToast();

    const itemCategories = [
        { value: "HEADWEAR", label: "Headwear" },
        { value: "UPPERWEAR", label: "Upperwear" },
        { value: "LOWERWEAR", label: "Lowerwear" },
        { value: "FOOTWEAR", label: "Footwear" },
        { value: "ACCESSORIES", label: "Accessories" },
        { value: "SOCKS", label: "Socks" },
        { value: "OTHER", label: "Other" },
    ];

    const addItem = () => {
        setItems([
            ...items,
            {
                name: "",
                category: "",
                description: "",
                purchaseUrl: "",
                id: Date.now()
            },
        ]);
    };

    const removeItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const updateItem = (index: number, field: keyof OutfitItem, value: string) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };
        setItems(newItems);
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
                description: "Please upload an image or provide an image URL. Images are required to help visualize your outfit.",
            });
            return;
        }

        try {
            const tags = formData.tags.split(",").map(tag => tag.trim()).filter(tag => tag.length > 0);
            const validItems = items.filter(item => item.name && item.category);

            const updatedOutfit = {
                ...outfit,
                name: formData.name,
                description: formData.description,
                imageUrl: formData.imageUrl,
                tags,
                isPrivate: formData.isPrivate,
                items: validItems.map(item => ({
                    id: item.id,
                    name: item.name,
                    category: item.category,
                    description: item.description || undefined,
                    purchaseUrl: item.purchaseUrl || undefined,
                })),
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
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (checked: boolean) => {
        setFormData(prev => ({ ...prev, isPrivate: checked }));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6" data-testid="edit-outfit-form">
            <div className="space-y-4">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <Label htmlFor="name" className="text-sm font-semibold text-foreground">Outfit Name *</Label>
                        <Input
                            type="text"
                            id="name"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter outfit name"
                            className="h-12 text-lg border-2 border-border/50 focus:border-royal transition-colors"
                            data-testid="edit-outfit-name-input"
                        />
                    </div>

                    <div className="space-y-3">
                        <Label htmlFor="tags" className="text-sm font-semibold text-foreground">Tags (comma-separated)</Label>
                        <Input
                            type="text"
                            id="tags"
                            name="tags"
                            value={formData.tags}
                            onChange={handleChange}
                            placeholder="casual, summer, formal"
                            className="h-12 text-lg border-2 border-border/50 focus:border-royal transition-colors"
                            data-testid="edit-outfit-tags-input"
                        />
                    </div>
                </div>

                <div className="space-y-3">
                    <Label htmlFor="description" className="text-sm font-semibold text-foreground">Description</Label>
                    <Textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Describe your outfit..."
                        className="min-h-[100px] text-lg border-2 border-border/50 focus:border-royal transition-colors resize-none"
                        data-testid="edit-outfit-description-textarea"
                    />
                </div>

                <div className="space-y-3">
                    <Label className="text-sm font-semibold text-foreground">Outfit Image *</Label>
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
                    <Label htmlFor="isPrivate" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Make this outfit private
                    </Label>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <PersonStanding className="h-5 w-5 text-royal" />
                        <h3 className="text-lg font-semibold text-foreground">Outfit Items</h3>
                    </div>
                    <Button
                        type="button"
                        onClick={addItem}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                        data-testid="edit-add-item-button"
                    >
                        <Plus className="h-4 w-4" />
                        Add Item
                    </Button>
                </div>

                {items.map((item, index) => (
                    <Card key={index} className="border-2 border-border/50">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-4">
                                <CardDescription className="text-sm font-medium">
                                    Item {index + 1}
                                </CardDescription>
                                <Button
                                    type="button"
                                    onClick={() => removeItem(index)}
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                                    data-testid={`edit-remove-item-button-${index}`}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <Label className="text-sm font-semibold text-foreground">
                                        {item.category ? `${itemCategories.find(cat => cat.value === item.category)?.label} Name *` : 'Item Name *'}
                                    </Label>
                                    <Input
                                        value={item.name}
                                        onChange={(e) => updateItem(index, "name", e.target.value)}
                                        placeholder={item.category ?
                                            (item.category === 'UPPERWEAR' ? 'e.g., Nike Air Max, Levi\'s 501 Jeans' :
                                                item.category === 'LOWERWEAR' ? 'e.g., Levi\'s 501 Jeans, Nike Joggers' :
                                                    item.category === 'FOOTWEAR' ? 'e.g., Nike Air Max, Converse Chuck Taylor' :
                                                        item.category === 'HEADWEAR' ? 'e.g., New Era Cap, Beanie' :
                                                            item.category === 'ACCESSORIES' ? 'e.g., Ray-Ban Aviators, Apple Watch' :
                                                                'e.g., Brand Name, Model') :
                                            'e.g., Nike Air Max, Levi\'s 501 Jeans'
                                        }
                                        className="h-12 border-2 border-border/50 focus:border-royal transition-colors"
                                        data-testid={`edit-item-name-input-${index}`}
                                    />
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-sm font-semibold text-foreground">Category *</Label>
                                    <Select
                                        value={item.category}
                                        onValueChange={(value) => updateItem(index, "category", value)}
                                    >
                                        <SelectTrigger className="h-12 border-2 border-border/50 focus:border-royal transition-colors" data-testid={`edit-item-category-select-${index}`}>
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {itemCategories.map((category) => (
                                                <SelectItem key={category.value} value={category.value}>
                                                    {category.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                <div className="space-y-3">
                                    <Label className="text-sm font-semibold text-foreground">Description</Label>
                                    <Input
                                        value={item.description}
                                        onChange={(e) => updateItem(index, "description", e.target.value)}
                                        placeholder="e.g., Blue denim, comfortable fit"
                                        className="h-12 border-2 border-border/50 focus:border-royal transition-colors"
                                        data-testid={`edit-item-description-input-${index}`}
                                    />
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-sm font-semibold text-foreground">Purchase URL</Label>
                                    <Input
                                        value={item.purchaseUrl}
                                        onChange={(e) => updateItem(index, "purchaseUrl", e.target.value)}
                                        placeholder="https://example.com/product"
                                        className="h-12 border-2 border-border/50 focus:border-royal transition-colors"
                                        data-testid={`edit-item-purchase-url-input-${index}`}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="flex gap-4 pt-4">
                <Button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-royal hover:bg-royal/90 text-white"
                    data-testid="edit-outfit-save-button"
                >
                    {isLoading ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                    type="button"
                    onClick={onCancel}
                    variant="outline"
                    className="flex-1"
                    data-testid="edit-outfit-cancel-button"
                >
                    Cancel
                </Button>
            </div>
        </form>
    );
} 