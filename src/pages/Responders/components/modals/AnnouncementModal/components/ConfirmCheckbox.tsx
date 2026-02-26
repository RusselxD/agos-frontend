interface ConfirmCheckboxProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
}

export default function ConfirmCheckbox({ checked, onChange }: ConfirmCheckboxProps) {
    return (
        <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
            />
            I confirm this message should be sent to the selected recipients.
        </label>
    );
}
