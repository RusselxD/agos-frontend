import type { Dispatch, SetStateAction } from "react";

interface NumberOnlyInputFieldProps {
    value: string;
    setValue: Dispatch<SetStateAction<string>> | ((value: string) => void);
}

export default function NumberOnlyInputField({
    value,
    setValue,
}: NumberOnlyInputFieldProps) {
    return (
        <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="9XXXXXXXXX"
            className="custom-input w-full pl-14"
            onKeyDown={(e) => {
                // Allow Ctrl/Cmd shortcuts (paste, copy, cut, select all)
                if (e.ctrlKey || e.metaKey) {
                    return;
                }

                // Only allow numbers, backspace, delete, arrow keys, tab
                const allowedKeys = [
                    "Backspace",
                    "Delete",
                    "ArrowLeft",
                    "ArrowRight",
                    "Tab",
                    "Enter",
                ];

                if (!allowedKeys.includes(e.key) && !/[0-9]/.test(e.key)) {
                    e.preventDefault();
                }
            }}
            onPaste={(e) => {
                // Handle paste - extract digits and strip +63/0 prefix
                e.preventDefault();
                const pastedText = e.clipboardData.getData("text");
                let digitsOnly = pastedText.replace(/\D/g, "");

                // Strip country code prefix if present
                if (digitsOnly.startsWith("63") && digitsOnly.length >= 12) {
                    digitsOnly = digitsOnly.substring(2); // Remove "63"
                } else if (
                    digitsOnly.startsWith("0") &&
                    digitsOnly.length >= 11
                ) {
                    digitsOnly = digitsOnly.substring(1); // Remove leading "0"
                }

                setValue(digitsOnly);
            }}
            inputMode="numeric" // Shows numeric keyboard on mobile
            pattern="[0-9]*" // iOS numeric keyboard
        />
    );
}
