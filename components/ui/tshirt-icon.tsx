import React from 'react';

interface TShirtIconProps {
    className?: string;
    size?: number;
}

export function TShirtIcon({ className = "w-4 h-4", size }: TShirtIconProps) {
    return (
        <svg
            className={className}
            width={size}
            height={size}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 3h12l-1.5 1.5L15 6h-6l-1.5-1.5L6 3zM6 6h12v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6z"
            />
        </svg>
    );
} 