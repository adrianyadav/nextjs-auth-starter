import Link from "next/link";
import { Shirt } from "lucide-react";

interface LogoProps {
    variant?: 'header' | 'footer' | 'default';
    showText?: boolean;
    className?: string;
    iconClassName?: string;
    textClassName?: string;
    href?: string;
}

export function Logo({
    variant = 'default',
    showText = true,
    className = "",
    iconClassName = "",
    textClassName = "",
    href = "/"
}: LogoProps) {
    const getIconSize = () => {
        switch (variant) {
            case 'header': return "w-5 h-5";
            case 'footer': return "w-5 h-5";
            default: return "w-6 h-6";
        }
    };

    const getTextSize = () => {
        switch (variant) {
            case 'header': return "text-xl font-bold";
            case 'footer': return "text-xl font-bold";
            default: return "text-lg font-bold";
        }
    };

    const getContainerClasses = () => {
        switch (variant) {
            case 'header': return "flex items-center gap-3 text-xl font-bold hover:opacity-80 transition-all duration-300 transform hover:scale-105";
            case 'footer': return "flex items-center gap-3 text-xl font-bold hover:opacity-80 transition-all duration-300 transform hover:scale-105";
            default: return "flex items-center gap-2";
        }
    };

    const getTextClasses = () => {
        const baseClasses = getTextSize();
        const gradientClass = variant === 'header' ? "text-gradient-royal font-black tracking-wide" : "text-gradient-royal";
        return `${baseClasses} ${gradientClass} ${textClassName}`;
    };

    const getIconClasses = () => {
        const baseClasses = getIconSize();
        const colorClass = variant === 'footer' ? "text-white" : "";
        return `${baseClasses} ${colorClass} ${iconClassName}`;
    };

    const logoContent = (
        <>
            <div className={`${variant === 'footer' ? 'w-8 h-8 bg-gradient-royal rounded-lg flex items-center justify-center' : ''}`}>
                <Shirt className={getIconClasses()} />
            </div>
            {showText && (
                <span className={getTextClasses()}>
                    Outfit Save
                </span>
            )}
        </>
    );

    if (href) {
        return (
            <Link href={href} className={`${getContainerClasses()} ${className}`}>
                {logoContent}
            </Link>
        );
    }

    return (
        <div className={`${getContainerClasses()} ${className}`}>
            {logoContent}
        </div>
    );
} 