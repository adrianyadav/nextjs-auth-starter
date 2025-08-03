import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './button';

const meta: Meta<typeof Button> = {
    title: 'UI/Button',
    component: Button,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: { type: 'select' },
            options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
        },
        size: {
            control: { type: 'select' },
            options: ['default', 'sm', 'lg', 'icon'],
        },
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        children: 'Primary Button',
        className: 'bg-gradient-royal hover:bg-gradient-royal-light text-white transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg',
    },
};

export const Secondary: Story = {
    args: {
        variant: 'outline',
        children: 'Secondary Button',
        className: 'border-royal/30 text-royal hover:bg-royal hover:text-white transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md',
    },
};

export const Destructive: Story = {
    args: {
        variant: 'destructive',
        children: 'Delete',
        className: 'bg-red-600 hover:bg-red-700 text-white transition-all duration-300',
    },
};

export const Small: Story = {
    args: {
        size: 'sm',
        children: 'Small Button',
        className: 'bg-gradient-royal hover:bg-gradient-royal-light text-white',
    },
};

export const Large: Story = {
    args: {
        size: 'lg',
        children: 'Large Button',
        className: 'bg-gradient-royal hover:bg-gradient-royal-light text-white',
    },
};

export const Disabled: Story = {
    args: {
        children: 'Disabled Button',
        disabled: true,
        className: 'bg-gradient-royal text-white opacity-50 cursor-not-allowed',
    },
};

export const WithIcon: Story = {
    args: {
        children: (
            <>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Item
            </>
        ),
        className: 'bg-gradient-royal hover:bg-gradient-royal-light text-white',
    },
};

export const AllVariants: Story = {
    render: () => (
        <div className="space-y-4">
            <div className="flex gap-4">
                <Button className="bg-gradient-royal hover:bg-gradient-royal-light text-white">
                    Primary
                </Button>
                <Button variant="outline" className="border-royal/30 text-royal hover:bg-royal hover:text-white">
                    Secondary
                </Button>
                <Button variant="destructive">Destructive</Button>
            </div>
            <div className="flex gap-4">
                <Button size="sm" className="bg-gradient-royal hover:bg-gradient-royal-light text-white">
                    Small
                </Button>
                <Button size="default" className="bg-gradient-royal hover:bg-gradient-royal-light text-white">
                    Default
                </Button>
                <Button size="lg" className="bg-gradient-royal hover:bg-gradient-royal-light text-white">
                    Large
                </Button>
            </div>
        </div>
    ),
}; 