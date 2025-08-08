import { Card, CardContent } from "@/components/ui/card";
import { ReactNode } from "react";

interface FormLayoutProps {
    children: ReactNode;
    className?: string;
}

export function FormLayout({ children, className = "" }: FormLayoutProps) {
    return (
        <Card className={`shadow-xl border-0 bg-card/50 backdrop-blur-sm ${className}`}>
            <CardContent className="p-8">
                {children}
            </CardContent>
        </Card>
    );
}
