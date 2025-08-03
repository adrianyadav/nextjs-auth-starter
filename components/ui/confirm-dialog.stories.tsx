import type { Meta, StoryObj } from '@storybook/react';
import ConfirmDialog from './confirm-dialog';
import { useState } from 'react';

const meta: Meta<typeof ConfirmDialog> = {
    title: 'UI/ConfirmDialog',
    component: ConfirmDialog,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        isOpen: {
            control: 'boolean',
        },
        title: {
            control: 'text',
        },
        message: {
            control: 'text',
        },
        confirmText: {
            control: 'text',
        },
        cancelText: {
            control: 'text',
        },
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        isOpen: true,
        title: 'Confirm Action',
        message: 'Are you sure you want to proceed with this action?',
        confirmText: 'Confirm',
        cancelText: 'Cancel',
        onConfirm: () => console.log('Confirmed'),
        onCancel: () => console.log('Cancelled'),
        onClose: () => console.log('Closed'),
    },
};

export const DeleteConfirmation: Story = {
    args: {
        isOpen: true,
        title: 'Delete Outfit',
        message: 'This action cannot be undone. This will permanently delete the outfit and remove it from your collection.',
        confirmText: 'Delete',
        cancelText: 'Cancel',
        onConfirm: () => console.log('Deleted'),
        onCancel: () => console.log('Cancelled'),
        onClose: () => console.log('Closed'),
    },
};

export const LongMessage: Story = {
    args: {
        isOpen: true,
        title: 'Important Notice',
        message: 'This is a very long message that demonstrates how the dialog handles text overflow and wrapping. It should be properly formatted and readable within the dialog constraints.',
        confirmText: 'I Understand',
        cancelText: 'Go Back',
        onConfirm: () => console.log('Confirmed'),
        onCancel: () => console.log('Cancelled'),
        onClose: () => console.log('Closed'),
    },
};

export const CustomButtons: Story = {
    args: {
        isOpen: true,
        title: 'Save Changes',
        message: 'You have unsaved changes. Do you want to save them before leaving?',
        confirmText: 'Save',
        cancelText: 'Don\'t Save',
        onConfirm: () => console.log('Saved'),
        onCancel: () => console.log('Not saved'),
        onClose: () => console.log('Closed'),
    },
};

export const WarningDialog: Story = {
    args: {
        isOpen: true,
        title: '⚠️ Warning',
        message: 'This action will affect multiple items. Please review your selection before proceeding.',
        confirmText: 'Proceed',
        cancelText: 'Review',
        onConfirm: () => console.log('Proceeded'),
        onCancel: () => console.log('Reviewing'),
        onClose: () => console.log('Closed'),
    },
};

export const Interactive: Story = {
    render: () => {
        const [isOpen, setIsOpen] = useState(false);

        return (
            <div className="space-y-4">
                <button
                    onClick={() => setIsOpen(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Open Dialog
                </button>

                <ConfirmDialog
                    isOpen={isOpen}
                    title="Interactive Dialog"
                    message="This dialog can be opened and closed interactively. Try clicking the buttons!"
                    confirmText="Confirm"
                    cancelText="Cancel"
                    onConfirm={() => {
                        console.log('Confirmed');
                        setIsOpen(false);
                    }}
                    onCancel={() => {
                        console.log('Cancelled');
                        setIsOpen(false);
                    }}
                    onClose={() => setIsOpen(false)}
                />
            </div>
        );
    },
};

export const Closed: Story = {
    args: {
        isOpen: false,
        title: 'This dialog is closed',
        message: 'You should not see this message.',
        confirmText: 'Confirm',
        cancelText: 'Cancel',
        onConfirm: () => console.log('Confirmed'),
        onCancel: () => console.log('Cancelled'),
        onClose: () => console.log('Closed'),
    },
}; 