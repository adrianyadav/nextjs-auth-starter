import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ITEM_CATEGORIES, getItemPlaceholder } from "@/lib/constants";

interface FormFieldProps {
    label: string;
    required?: boolean;
    className?: string;
}

interface InputFieldProps extends FormFieldProps {
    id: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    type?: string;
    testId?: string;
}

interface TextareaFieldProps extends FormFieldProps {
    id: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    placeholder?: string;
    rows?: number;
    testId?: string;
}

interface SelectFieldProps extends FormFieldProps {
    value: string;
    onValueChange: (value: string) => void;
    placeholder?: string;
    testId?: string;
}

export function InputField({
    label,
    required = false,
    className = "",
    testId,
    ...props
}: InputFieldProps) {
    return (
        <div className={`space-y-3 ${className}`}>
            <Label className="text-sm font-semibold text-foreground">
                {label} {required && "*"}
            </Label>
            <Input
                className="h-12 text-lg border-2 border-border/50 focus:border-royal transition-colors"
                data-testid={testId}
                {...props}
            />
        </div>
    );
}

export function TextareaField({
    label,
    required = false,
    className = "",
    testId,
    ...props
}: TextareaFieldProps) {
    return (
        <div className={`space-y-3 ${className}`}>
            <Label className="text-sm font-semibold text-foreground">
                {label} {required && "*"}
            </Label>
            <Textarea
                className="text-lg border-2 border-border/50 focus:border-royal transition-colors resize-none"
                data-testid={testId}
                {...props}
            />
        </div>
    );
}

export function CategorySelectField({
    label,
    required = false,
    className = "",
    testId,
    ...props
}: SelectFieldProps) {
    return (
        <div className={`space-y-3 ${className}`}>
            <Label className="text-sm font-semibold text-foreground">
                {label} {required && "*"}
            </Label>
            <Select {...props}>
                <SelectTrigger className="h-12 border-2 border-border/50 focus:border-royal transition-colors" data-testid={testId}>
                    <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                    {ITEM_CATEGORIES.map((category) => (
                        <SelectItem
                            key={category.value}
                            value={category.value}
                            data-testid={`${testId?.replace('-select-', '-option-')}-${category.value}`}
                        >
                            {category.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}

export function ItemNameField({
    category,
    index,
    value,
    onChange,
    testId
}: {
    category: string;
    index: number;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    testId?: string;
}) {
    const categoryLabel = ITEM_CATEGORIES.find(cat => cat.value === category)?.label || 'Clothing Item';
    const placeholder = getItemPlaceholder(category);

    return (
        <InputField
            label={`${categoryLabel} Name`}
            required
            id={`item-name-${index}`}
            name={`item-name-${index}`}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            testId={testId}
        />
    );
}
