import type { Dispatch, SetStateAction } from "react";

interface TextInputFieldProps {
    value: string;
    setValue: Dispatch<SetStateAction<string>>;
    label: string;
    placeholder: string;
}

export default function TextInputField({
    value,
    setValue,
    label,
    placeholder,
}: TextInputFieldProps) {
    return (
        <label className="flex flex-col w-full">
            <span className="text-sm text-gray-700 font-semibold">{label}</span>
            <div className="w-full relative">
                <input
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder={placeholder}
                    className="custom-input w-full"
                />
            </div>
        </label>
    );
}
