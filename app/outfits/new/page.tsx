"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import ImageUpload from "@/components/ui/image-upload";
import { Plus, Shirt, PersonStanding, Clock } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { InputField, TextareaField } from "@/components/ui/form-fields";
import { OutfitItemCard } from "@/components/ui/outfit-item-card";
import { useOutfitItems } from "@/hooks/use-outfit-items";

interface PreviousItem {
    name: string;
    category: string;
    description: string;
    purchaseUrl: string;
    usageCount: number;
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
    const [previousItems, setPreviousItems] = useState<PreviousItem[]>([]);
    const [showQuickAdd, setShowQuickAdd] = useState(false);
    const [isLoadingPreviousItems, setIsLoadingPreviousItems] = useState(false);
    const { toast } = useToast();

    // Use the custom hook for item management
    const { items, addItem, removeItem, updateItem, addItemFromPrevious } = useOutfitItems();

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
            } else {
                console.error("Failed to fetch previous items");
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
                credentials: "include",
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
                                    <InputField
                                        label="Outfit Name"
                                        required
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Enter outfit name"
                                        testId="outfit-name-input"
                                    />

                                    <InputField
                                        label="Tags (comma-separated)"
                                        id="tags"
                                        name="tags"
                                        value={formData.tags}
                                        onChange={handleChange}
                                        placeholder="casual, summer, formal"
                                        testId="outfit-tags-input"
                                    />
                                </div>

                                <TextareaField
                                    label="Description"
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={4}
                                    placeholder="Describe your outfit, when you'd wear it, or any special details..."
                                    testId="outfit-description-textarea"
                                />

                                <div className="space-y-3">
                                    <label className="text-sm font-semibold text-foreground">Outfit Image *</label>
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
                                        <label htmlFor="isPrivate" className="text-sm font-semibold text-foreground">Make this outfit private</label>
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
                                    <div className="flex gap-3">
                                        {previousItems.length > 0 && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="lg"
                                                onClick={() => setShowQuickAdd(!showQuickAdd)}
                                                className="border-2 border-royal/30 text-royal hover:bg-royal hover:text-royal-foreground transition-all duration-300"
                                                data-testid="quick-add-button"
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
                                            className="border-2 border-royal/30 text-royal hover:bg-royal hover:text-royal-foreground transition-all duration-300 transform hover:scale-105"
                                            data-testid="add-item-button"
                                        >
                                            <Plus className="h-5 w-5 mr-2" />
                                            Add Item
                                        </Button>
                                    </div>
                                </div>

                                {/* Quick Add Dropdown */}
                                {showQuickAdd && previousItems.length > 0 && (
                                    <Card className="p-4 border-2 border-royal/20 bg-card/50 shadow-lg" data-testid="quick-add-dropdown">
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
                                                    data-testid={`quick-add-item-${index}`}
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
                                    <OutfitItemCard
                                        key={index}
                                        item={item}
                                        index={index}
                                        onUpdate={updateItem}
                                        onRemove={removeItem}
                                        testIdPrefix="item"
                                    />
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