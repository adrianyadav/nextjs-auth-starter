import { Button } from "@/components/ui/button";
import { ButtonProps } from "@/components/ui/button";
import { ReactNode } from "react";

interface LoadingButtonProps extends ButtonProps {
    loading?: boolean;
    loadingText?: string;
    children: ReactNode;
}

export function LoadingButton({
    loading = false,
    loadingText = "Loading...",
    children,
    disabled,
    ...props
}: LoadingButtonProps) {
    return (
        <Button disabled={disabled || loading} {...props}>
            {loading ? (
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                    {loadingText}
                </div>
            ) : (
                children
            )}
        </Button>
    );
}
