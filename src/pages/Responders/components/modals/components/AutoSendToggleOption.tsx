interface AutoSendToggleOptionProps {
    label: string;
    description: string;
    isSelected: boolean;
    onToggle: () => void;
}

export default function AutoSendToggleOption({
    label,
    description,
    isSelected,
    onToggle,
}: AutoSendToggleOptionProps) {
    return (
        <div className="flex flex-col gap-1 w-full">
            <label className="flex items-center justify-between w-full">
                <span className="text-sm text-gray-700 font-semibold">
                    {label}
                </span>
                <button
                    type="button"
                    onClick={onToggle}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        isSelected ? "bg-gray-800" : "bg-gray-300"
                    }`}
                    aria-pressed={isSelected}
                >
                    <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                            isSelected ? "translate-x-5" : "translate-x-1"
                        }`}
                    />
                </button>
            </label>
            <p className="text-xs text-gray-600">{description}</p>
        </div>
    );
}
