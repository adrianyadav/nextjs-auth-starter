import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta: Meta = {
    title: 'Test/Simple',
    parameters: {
        layout: 'centered',
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const HelloWorld: Story = {
    render: () => (
        <div className="p-8 bg-blue-100 rounded-lg">
            <h1 className="text-2xl font-bold text-blue-800">Hello Storybook!</h1>
            <p className="text-blue-600">If you can see this, Storybook is working!</p>
        </div>
    ),
};

export const BasicButton: Story = {
    render: () => (
        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Click me!
        </button>
    ),
}; 