import type { Dispatch, SetStateAction } from "react";

interface TextInputFieldProps {
    value: string;
    setValue: Dispatch<SetStateAction<string>>;
    label: string;
    placeholder: string;
    className?: string;
}

export default function TextInputField({
    value,
    setValue,
    label,
    placeholder,
    className,
}: TextInputFieldProps) {
    return (
        <label className="flex flex-col w-full">
            <span className="text-sm text-gray-700 dark:text-slate-300 font-semibold transition-colors">{label}</span>
            <div className="w-full relative">
                <input
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder={placeholder}
                    className={`custom-input w-full ${className ?? ""}`}
                />
            </div>
        </label>
    );
}
