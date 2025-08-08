import { useState } from "react";

export interface OutfitItem {
    id?: number;
    name: string;
    category: string;
    description: string;
    purchaseUrl: string;
}

export function useOutfitItems(initialItems: OutfitItem[] = []) {
    const [items, setItems] = useState<OutfitItem[]>(initialItems);

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

    const addItemFromPrevious = (previousItem: any) => {
        setItems([
            ...items,
            {
                name: previousItem.name,
                category: previousItem.category,
                description: previousItem.description || "",
                purchaseUrl: previousItem.purchaseUrl || "",
            },
        ]);
    };

    return {
        items,
        addItem,
        removeItem,
        updateItem,
        addItemFromPrevious,
        setItems,
    };
}
