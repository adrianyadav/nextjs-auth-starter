"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import ImageUpload from "@/components/ui/image-upload";
import { Plus, X } from "lucide-react";

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
        isPrivate: false,
    });
    const [items, setItems] = useState<OutfitItem[]>([]);

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
                router.push("/outfits");
            } else {
                throw new Error("Failed to create outfit");
            }
        } catch (error) {
            console.error("Error creating outfit:", error);
            alert("Failed to create outfit. Please try again.");
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
        <div className="min-h-screen bg-background flex flex-col items-center justify-start p-8">
            <div className="w-full max-w-4xl">
                <CardHeader className="px-0">
                    <CardTitle className="text-3xl">Save New Outfit</CardTitle>
                </CardHeader>

                <Card>
                    <CardContent className="p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Basic Outfit Information */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Basic Information</h3>

                                <div className="space-y-2">
                                    <Label htmlFor="name">Outfit Name *</Label>
                                    <Input
                                        type="text"
                                        id="name"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Enter outfit name"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows={3}
                                        placeholder="Describe your outfit..."
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Outfit Image</Label>
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

                                <div className="space-y-2">
                                    <Label htmlFor="tags">Tags (comma-separated)</Label>
                                    <Input
                                        type="text"
                                        id="tags"
                                        name="tags"
                                        value={formData.tags}
                                        onChange={handleChange}
                                        placeholder="casual, summer, formal"
                                    />
                                    <CardDescription>Add tags to help organize your outfits</CardDescription>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="isPrivate"
                                        checked={formData.isPrivate}
                                        onCheckedChange={handleCheckboxChange}
                                    />
                                    <Label htmlFor="isPrivate">Make this outfit private</Label>
                                </div>
                                <CardDescription>
                                    Private outfits are only visible to you and cannot be shared
                                </CardDescription>
                            </div>

                            {/* Outfit Items */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold">Outfit Items</h3>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={addItem}
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Item
                                    </Button>
                                </div>

                                {items.length === 0 && (
                                    <CardDescription>
                                        Add individual items to your outfit to track what you&apos;re wearing
                                    </CardDescription>
                                )}

                                {items.map((item, index) => (
                                    <Card key={index} className="p-4">
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="font-medium">Item {index + 1}</h4>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeItem(index)}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Item Name *</Label>
                                                <Input
                                                    value={item.name}
                                                    onChange={(e) => updateItem(index, "name", e.target.value)}
                                                    placeholder="e.g., Nike Air Max, Levi&apos;s 501 Jeans"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Category *</Label>
                                                <Select
                                                    value={item.category}
                                                    onValueChange={(value) => updateItem(index, "category", value)}
                                                >
                                                    <SelectTrigger>
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

                                            <div className="space-y-2">
                                                <Label>Description</Label>
                                                <Input
                                                    value={item.description}
                                                    onChange={(e) => updateItem(index, "description", e.target.value)}
                                                    placeholder="Optional description"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Purchase Link</Label>
                                                <Input
                                                    type="url"
                                                    value={item.purchaseUrl}
                                                    onChange={(e) => updateItem(index, "purchaseUrl", e.target.value)}
                                                    placeholder="https://store.com/item"
                                                />
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>

                            <div className="flex justify-end space-x-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.back()}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Saving..." : "Save Outfit"}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
