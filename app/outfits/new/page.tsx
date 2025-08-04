"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import ImageUpload from "@/components/ui/image-upload";
import { Plus, X, Shirt, PersonStanding } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface OutfitItem {
    name: string;
    category: string;
    description: string;
    purchaseUrl: string;
}

export default function NewOutfitPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        imageUrl: "",
        tags: "",
        isPrivate: true,
    });
    const [items, setItems] = useState<OutfitItem[]>([]);
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

        setIsLoading(true);

        try {
            const tags = formData.tags.split(",").map(tag => tag.trim()).filter(tag => tag.length > 0);
            const validItems = items.filter(item => item.name && item.category);

            const response = await fetch("/api/outfits", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...formData,
                    tags,
                    items: validItems,
                }),
            });

            if (response.ok) {
                router.push("/my-outfits");
            } else {
                const errorData = await response.json();
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: errorData.error || "Failed to create outfit. Please try again.",
                });
            }
        } catch (error) {
            console.error("Error creating outfit:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to create outfit. Please try again.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleCheckboxChange = (checked: boolean) => {
        setFormData({
            ...formData,
            isPrivate: checked,
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header Section */}
                <div className="mb-12">
                    <h1 className="text-5xl md:text-6xl font-black text-foreground mb-6 leading-tight">
                        Save New <span className="text-gradient-royal">Outfit</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
                        Create and organize your perfect outfit with all the details that matter
                    </p>
                </div>

                <Card className="shadow-xl border-0 bg-card/50 backdrop-blur-sm">
                    <CardContent className="p-8">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Basic Outfit Information */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-8 h-8 bg-gradient-royal rounded-lg flex items-center justify-center">
                                        <PersonStanding className="w-4 h-4 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-foreground">Basic Information</h3>
                                </div>

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
                                            data-testid="outfit-name-input"
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
                                            data-testid="outfit-tags-input"
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
                                        rows={4}
                                        placeholder="Describe your outfit, when you'd wear it, or any special details..."
                                        className="text-lg border-2 border-border/50 focus:border-royal transition-colors resize-none"
                                        data-testid="outfit-description-textarea"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-sm font-semibold text-foreground">Outfit Image *</Label>
                                    <div className="border-2 border-dashed border-border/50 rounded-lg p-6 bg-muted/20">
                                        <ImageUpload
                                            onImageUpload={(imageUrl) => {
                                                setFormData({
                                                    ...formData,
                                                    imageUrl,
                                                });
                                            }}
                                            currentImageUrl={formData.imageUrl}
                                        />
                                    </div>
                                    <CardDescription className="text-sm text-muted-foreground/80">
                                        An image is required to help visualize your outfit. Upload a photo or provide an image URL.
                                    </CardDescription>
                                </div>

                                <div className="flex items-center space-x-3 p-4 bg-muted/30 rounded-lg border border-border/50">
                                    <Checkbox
                                        id="isPrivate"
                                        checked={formData.isPrivate}
                                        onCheckedChange={handleCheckboxChange}
                                        data-testid="outfit-private-checkbox"
                                    />
                                    <div>
                                        <Label htmlFor="isPrivate" className="text-sm font-semibold text-foreground">Make this outfit private</Label>
                                        <CardDescription className="text-xs text-muted-foreground/80">
                                            Private outfits are only visible to you and cannot be shared
                                        </CardDescription>
                                    </div>
                                </div>
                            </div>

                            {/* Outfit Items */}
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-gradient-royal rounded-lg flex items-center justify-center">
                                            <Shirt className="w-4 h-4 text-white" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-foreground">Outfit Items</h3>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="lg"
                                        onClick={addItem}
                                        className="border-2 border-royal/30 text-royal hover:bg-royal hover:text-royal-foreground transition-all duration-300 transform hover:scale-105"
                                        data-testid="add-item-button"
                                    >
                                        <Plus className="h-5 w-5 mr-2" />
                                        Add Item
                                    </Button>
                                </div>

                                {items.length === 0 && (
                                    <div className="text-center py-12 bg-muted/20 rounded-lg border-2 border-dashed border-border/50">
                                        <svg className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                        </svg>
                                        <CardDescription className="text-lg text-muted-foreground">
                                            Add individual items to your outfit to track what you&apos;re wearing
                                        </CardDescription>
                                    </div>
                                )}

                                {items.map((item, index) => (
                                    <Card key={index} className="p-6 border-2 border-border/50 bg-card/50 shadow-lg">
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-6 h-6 bg-royal/20 rounded-full flex items-center justify-center">
                                                    <span className="text-sm font-bold text-royal">{index + 1}</span>
                                                </div>
                                                <h4 className="font-semibold text-lg text-foreground">
                                                    {item.category ? `${itemCategories.find(cat => cat.value === item.category)?.label || 'Clothing Item'}` : 'Clothing Item'}
                                                </h4>
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeItem(index)}
                                                className="text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors"
                                            >
                                                <X className="h-5 w-5" />
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
                                                    data-testid={`item-name-input-${index}`}
                                                />
                                            </div>

                                            <div className="space-y-3">
                                                <Label className="text-sm font-semibold text-foreground">Category *</Label>
                                                <Select
                                                    value={item.category}
                                                    onValueChange={(value) => updateItem(index, "category", value)}
                                                >
                                                    <SelectTrigger className="h-12 border-2 border-border/50 focus:border-royal transition-colors" data-testid={`item-category-select-${index}`}>
                                                        <SelectValue placeholder="Select category" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {itemCategories.map((category) => (
                                                            <SelectItem key={category.value} value={category.value} data-testid={`item-category-option-${category.value}-${index}`}>
                                                                {category.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="space-y-3">
                                                <Label className="text-sm font-semibold text-foreground">Description</Label>
                                                <Input
                                                    value={item.description}
                                                    onChange={(e) => updateItem(index, "description", e.target.value)}
                                                    placeholder="Optional details about this item"
                                                    className="h-12 border-2 border-border/50 focus:border-royal transition-colors"
                                                    data-testid={`item-description-input-${index}`}
                                                />
                                            </div>

                                            <div className="space-y-3">
                                                <Label className="text-sm font-semibold text-foreground">Purchase Link</Label>
                                                <Input
                                                    type="url"
                                                    value={item.purchaseUrl}
                                                    onChange={(e) => updateItem(index, "purchaseUrl", e.target.value)}
                                                    placeholder="https://store.com/item"
                                                    className="h-12 border-2 border-border/50 focus:border-royal transition-colors"
                                                    data-testid={`item-purchase-url-input-${index}`}
                                                />
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>

                            <div className="flex justify-end space-x-4 pt-8 border-t border-border/50">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.back()}
                                    className="px-8 py-3 border-2 border-border/50 hover:border-royal/30 text-foreground hover:text-royal transition-all duration-300"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="px-8 py-3 bg-gradient-royal hover:bg-gradient-royal-light text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                                    data-testid="save-outfit-button"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Saving...
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            Save Outfit
                                        </div>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
