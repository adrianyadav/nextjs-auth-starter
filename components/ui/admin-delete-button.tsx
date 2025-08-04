'use client';

import { useState } from 'react';
import { Button } from './button';
import ConfirmDialog from './confirm-dialog';
import { Trash2 } from 'lucide-react';
import { useToast } from './use-toast';

interface AdminDeleteButtonProps {
    outfitId: number;
    outfitName: string;
    onDelete?: () => void;
}

export function AdminDeleteButton({ outfitId, outfitName, onDelete }: AdminDeleteButtonProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const { toast } = useToast();

    const handleDelete = async () => {
        if (isDeleting) return;

        setIsDeleting(true);
        try {
            const response = await fetch(`/api/admin/outfits/${outfitId}`, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Admin delete successful:', data.message);
                toast({
                    title: "Success",
                    description: "Outfit deleted successfully",
                });
                onDelete?.();
            } else {
                const errorData = await response.json();
                console.error('Admin delete failed:', errorData);
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: errorData.error || "Failed to delete outfit",
                });
            }
        } catch (err) {
            console.error('Error deleting outfit:', err);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to delete outfit. Please try again later.",
            });
        } finally {
            setIsDeleting(false);
            setShowConfirmDialog(false);
        }
    };

    return (
        <>
            <Button
                variant="destructive"
                size="sm"
                data-testid={`admin-delete-button-${outfitId}`}
                onClick={() => setShowConfirmDialog(true)}
                disabled={isDeleting}
                className="flex items-center gap-2"
            >
                <Trash2 className="w-4 h-4" />
                {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>

            <ConfirmDialog
                isOpen={showConfirmDialog}
                title="Delete Outfit"
                message={`Are you sure you want to delete the public outfit "${outfitName}"? This action cannot be undone and will remove the outfit from the public browse page.`}
                confirmText="Delete"
                cancelText="Cancel"
                onConfirm={handleDelete}
                onCancel={() => setShowConfirmDialog(false)}
                onClose={() => setShowConfirmDialog(false)}
            />
        </>
    );
} 