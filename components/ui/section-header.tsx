import { LucideIcon } from "lucide-react";

interface SectionHeaderProps {
    icon: LucideIcon;
    title: string;
    className?: string;
}

export function SectionHeader({ icon: Icon, title, className = "" }: SectionHeaderProps) {
    return (
        <div className={`flex items-center gap-3 mb-6 ${className}`}>
            <div className="w-8 h-8 bg-gradient-royal rounded-lg flex items-center justify-center">
                <Icon className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-foreground">{title}</h3>
        </div>
    );
}
