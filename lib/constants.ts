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

export const ITEM_CATEGORY_COLORS = {
    HEADWEAR: {
        primary: "#8B4513", // Saddle Brown - warm, earthy tone for hats
        secondary: "#DEB887", // Burlywood - lighter accent
        background: "#FEFCF8", // Very light warm tint
    },
    UPPERWEAR: {
        primary: "#1E3A8A", // Navy Blue - classic and professional
        secondary: "#3B82F6", // Modern Blue - clean accent
        background: "#F8FBFF", // Very light blue tint
    },
    LOWERWEAR: {
        primary: "#2F4F4F", // Dark Slate Gray - sophisticated pants color
        secondary: "#708090", // Slate Gray - medium accent
        background: "#F8FAFC", // Very light gray tint
    },
    FOOTWEAR: {
        primary: "#8B0000", // Dark Red - bold shoe color
        secondary: "#DC143C", // Crimson - vibrant accent
        background: "#FFF8F8", // Very light red tint
    },
    ACCESSORIES: {
        primary: "#059669", // Deep Green - sophisticated and premium
        secondary: "#10B981", // Modern Green - elegant accent
        background: "#FFFEFF", // Very light gold tint
    },
    SOCKS: {
        primary: "#9370DB", // Medium Purple - fun sock color
        secondary: "#DDA0DD", // Plum - playful accent
        background: "#FDFAFF", // Very light purple tint
    },
    OTHER: {
        primary: "#696969", // Dim Gray - neutral for miscellaneous
        secondary: "#A9A9A9", // Dark Gray - subtle accent
        background: "#FAFAFA", // Very light neutral tint
    },
} as const;

// Helper function to get colors for a category
export const getCategoryColors = (category: string) => {
    return ITEM_CATEGORY_COLORS[category as keyof typeof ITEM_CATEGORY_COLORS] || ITEM_CATEGORY_COLORS.OTHER;
};

// Helper function to sort items by category order
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const sortItemsByCategory = (items: any[]) => {
    const categoryOrder = ITEM_CATEGORIES.map(cat => cat.value);
    return items.sort((a, b) => {
        const aIndex = categoryOrder.indexOf(a.category);
        const bIndex = categoryOrder.indexOf(b.category);
        return aIndex - bIndex;
    });
};
