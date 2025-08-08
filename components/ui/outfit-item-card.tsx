import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { InputField, CategorySelectField, ItemNameField } from "./form-fields";
import { ITEM_CATEGORIES, getCategoryColors } from "@/lib/constants";
import { OutfitItem } from "@/hooks/use-outfit-items";
import ItemImageUpload from "./item-image-upload";

interface OutfitItemCardProps {
    item: OutfitItem;
    index: number;
    onUpdate: (index: number, field: keyof OutfitItem, value: string) => void;
    onRemove: (index: number) => void;
    testIdPrefix?: string;
}

export function OutfitItemCard({
    item,
    index,
    onUpdate,
    onRemove,
    testIdPrefix = "item"
}: OutfitItemCardProps) {
    const categoryColors = getCategoryColors(item.category);

    return (
        <Card className="p-6 border-2 border-border/50 bg-card/50 shadow-lg">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-royal/20 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-royal">{index + 1}</span>
                    </div>
                    <h4
                        className="font-semibold text-lg"
                        style={{ color: categoryColors.primary }}
                    >
                        {item.category ?
                            `${ITEM_CATEGORIES.find(cat => cat.value === item.category)?.label || 'Clothing Item'}` :
                            'Clothing Item'
                        }
                    </h4>
                </div>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemove(index)}
                    className="text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors"
                    data-testid={`${testIdPrefix}-remove-button-${index}`}
                >
                    <X className="h-5 w-5" />
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ItemNameField
                    category={item.category}
                    index={index}
                    value={item.name}
                    onChange={(e) => onUpdate(index, "name", e.target.value)}
                    testId={`${testIdPrefix}-name-input-${index}`}
                />

                <CategorySelectField
                    label="Category"
                    required
                    value={item.category}
                    onValueChange={(value) => onUpdate(index, "category", value)}
                    testId={`${testIdPrefix}-category-select-${index}`}
                />

                <InputField
                    label="Description"
                    id={`item-description-${index}`}
                    name={`item-description-${index}`}
                    value={item.description}
                    onChange={(e) => onUpdate(index, "description", e.target.value)}
                    placeholder="Optional details about this item"
                    testId={`${testIdPrefix}-description-input-${index}`}
                />

                <InputField
                    label="Purchase Link"
                    type="url"
                    id={`item-purchase-url-${index}`}
                    name={`item-purchase-url-${index}`}
                    value={item.purchaseUrl}
                    onChange={(e) => onUpdate(index, "purchaseUrl", e.target.value)}
                    placeholder="https://store.com/item"
                    testId={`${testIdPrefix}-purchase-url-input-${index}`}
                />
            </div>

            <div className="mt-6">
                <h5 className="text-sm font-medium text-foreground mb-3">Item Image</h5>
                <ItemImageUpload
                    onImageUpload={(imageUrl) => onUpdate(index, "imageUrl", imageUrl)}
                    currentImageUrl={item.imageUrl}
                    itemName={item.name}
                />
            </div>
        </Card>
    );
}
