import type { Meta, StoryObj } from '@storybook/react';
import OutfitCard from './outfit-card';

const meta: Meta<typeof OutfitCard> = {
    title: 'UI/OutfitCard',
    component: OutfitCard,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        outfit: {
            control: 'object',
        },
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

const sampleOutfit = {
    id: 1,
    name: 'Summer Casual Outfit',
    description: 'A comfortable summer outfit for casual occasions',
    imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop',
    tags: ['casual', 'summer', 'comfortable'],
    isPrivate: false,
    createdAt: new Date().toISOString(),
    items: [
        {
            id: 1,
            name: 'Cotton T-Shirt',
            category: 'UPPERWEAR',
            description: 'Comfortable cotton t-shirt',
            purchaseUrl: 'https://example.com/tshirt',
        },
        {
            id: 2,
            name: 'Jeans',
            category: 'LOWERWEAR',
            description: 'Blue denim jeans',
        },
    ],
};

export const Default: Story = {
    args: {
        outfit: sampleOutfit,
    },
};

export const PrivateOutfit: Story = {
    args: {
        outfit: {
            ...sampleOutfit,
            isPrivate: true,
            name: 'Private Summer Outfit',
        },
    },
};

export const LongTitle: Story = {
    args: {
        outfit: {
            ...sampleOutfit,
            name: 'This is a very long outfit name that might wrap to multiple lines in the card layout',
        },
    },
};

export const LongDescription: Story = {
    args: {
        outfit: {
            ...sampleOutfit,
            description: 'This is a very long description that demonstrates how the card handles text overflow and wrapping in the layout. It should be properly truncated or wrapped.',
        },
    },
};

export const ManyTags: Story = {
    args: {
        outfit: {
            ...sampleOutfit,
            tags: ['casual', 'summer', 'comfortable', 'trendy', 'fashion', 'style', 'outdoor', 'weekend'],
        },
    },
};

export const NoTags: Story = {
    args: {
        outfit: {
            ...sampleOutfit,
            tags: [],
        },
    },
};

export const DifferentImage: Story = {
    args: {
        outfit: {
            ...sampleOutfit,
            imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=400&fit=crop',
            name: 'Fashion Forward Outfit',
        },
    },
};

export const LoadingState: Story = {
    args: {
        outfit: {
            ...sampleOutfit,
            imageUrl: '', // This will trigger loading state
        },
    },
};

export const GridLayout: Story = {
    render: () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl">
            <OutfitCard outfit={sampleOutfit} />
            <OutfitCard
                outfit={{
                    ...sampleOutfit,
                    id: 2,
                    name: 'Winter Formal',
                    imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=400&fit=crop',
                    tags: ['formal', 'winter', 'elegant'],
                }}
            />
            <OutfitCard
                outfit={{
                    ...sampleOutfit,
                    id: 3,
                    name: 'Sporty Active',
                    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
                    tags: ['sport', 'active', 'gym'],
                }}
            />
        </div>
    ),
    parameters: {
        layout: 'fullscreen',
    },
}; 