"use client";

import { Button } from "@/components/ui/button";
import { Trash2, AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel?: () => void;
    isOpen: boolean;
    onClose: () => void;
    isLoading?: boolean;
}

export default function ConfirmDialog({
    title,
    message,
    confirmText = "Delete",
    cancelText = "Cancel",
    onConfirm,
    onCancel,
    isOpen,
    onClose,
    isLoading = false
}: ConfirmDialogProps) {
    if (!isOpen) return null;

    const handleConfirm = () => {
        onConfirm();
    };

    const handleCancel = () => {
        onCancel?.();
        onClose();
    };

    return (
        <div data-testid="confirm-dialog" className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-background rounded-lg shadow-xl border border-border max-w-md w-full p-6 animate-in fade-in-0 zoom-in-95 duration-200">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-destructive/10 rounded-full flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-destructive" />
                    </div>
                    <h3 data-testid="confirm-dialog-title" className="text-lg font-semibold text-foreground">{title}</h3>
                </div>

                <p data-testid="confirm-dialog-message" className="text-muted-foreground mb-6 leading-relaxed">
                    {message}
                </p>

                <div className="flex gap-3 justify-end">
                    <Button
                        data-testid="confirm-dialog-cancel"
                        variant="outline"
                        onClick={handleCancel}
                        disabled={isLoading}
                        className="border-border hover:bg-muted"
                    >
                        {cancelText}
                    </Button>
                    <Button
                        data-testid="confirm-dialog-confirm"
                        variant="destructive"
                        onClick={handleConfirm}
                        disabled={isLoading}
                        className="bg-destructive hover:bg-destructive/90"
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                Deleting...
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Trash2 className="w-4 h-4" />
                                {confirmText}
                            </div>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
} 