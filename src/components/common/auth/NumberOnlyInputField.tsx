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
                // Handle paste - only allow digits
                const pastedText = e.clipboardData.getData("text");
                if (!/^\d+$/.test(pastedText)) {
                    e.preventDefault();
                }
            }}
            inputMode="numeric" // Shows numeric keyboard on mobile
            pattern="[0-9]*" // iOS numeric keyboard
        />
    );
}
