export const ITEM_CATEGORIES = [
    { value: "HEADWEAR", label: "Headwear" },
    { value: "UPPERWEAR", label: "Upperwear" },
    { value: "LOWERWEAR", label: "Lowerwear" },
    { value: "FOOTWEAR", label: "Footwear" },
    { value: "ACCESSORIES", label: "Accessories" },
    { value: "SOCKS", label: "Socks" },
    { value: "OTHER", label: "Other" },
] as const;

export const ITEM_PLACEHOLDERS = {
    HEADWEAR: "e.g., New Era Cap, Beanie",
    UPPERWEAR: "e.g., Nike Air Max, Levi's 501 Jeans",
    LOWERWEAR: "e.g., Levi's 501 Jeans, Nike Joggers",
    FOOTWEAR: "e.g., Nike Air Max, Converse Chuck Taylor",
    ACCESSORIES: "e.g., Ray-Ban Aviators, Apple Watch",
    SOCKS: "e.g., Nike Socks, Wool Socks",
    OTHER: "e.g., Brand Name, Model",
    DEFAULT: "e.g., Nike Air Max, Levi's 501 Jeans"
} as const;

export const getItemPlaceholder = (category?: string): string => {
    if (!category) return ITEM_PLACEHOLDERS.DEFAULT;
    return ITEM_PLACEHOLDERS[category as keyof typeof ITEM_PLACEHOLDERS] || ITEM_PLACEHOLDERS.DEFAULT;
};
