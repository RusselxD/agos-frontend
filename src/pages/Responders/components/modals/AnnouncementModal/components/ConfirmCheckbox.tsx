interface ConfirmCheckboxProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
}

export default function ConfirmCheckbox({ checked, onChange }: ConfirmCheckboxProps) {
    return (
        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-slate-300 cursor-pointer">
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                className="rounded border-gray-300 dark:border-slate-650 text-blue-600 bg-white dark:bg-slate-800 focus:ring-blue-500 dark:focus:ring-offset-slate-800"
            />
            I confirm this message should be sent to the selected recipients.
        </label>
    );
}
