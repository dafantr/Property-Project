import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface FormInputProps {
    type: string;
    name: string;
    label: string;
    defaultValue?: string;
    className?: string;
    labelClassName?: string;
    readonly?: boolean;
    placeholder?: any;
    required?: boolean;
}

export default function FormInput({
    type,
    name,
    label,
    defaultValue,
    className,
    labelClassName,
    readonly,
    required = true,
    placeholder
}: FormInputProps) {
    return (
        <div className="form-group">
            <label
                htmlFor={name}
                className={`block mb-2 text-sm font-medium dark:text-gray-200 ${labelClassName}`}
            >
                {label}
            </label>
            <input
                type={type}
                id={name}
                name={name}
                defaultValue={defaultValue}
                className={`w-full px-4 py-2 rounded-lg border bg-white dark:bg-black dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-primary/50 ${className}`}
                required={required}
                readOnly={readonly}
                placeholder={placeholder}
            />
        </div>
    );
}
