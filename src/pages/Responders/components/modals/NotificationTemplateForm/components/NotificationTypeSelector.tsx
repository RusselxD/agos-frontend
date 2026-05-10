import type { NotificationType } from "../../../../../../types/responder";
import { capitalizeFirstLetter } from "../../../../../../lib/utils/formatter";

interface NotificationTypeOption {
    value: NotificationType;
    label: string;
}

interface NotificationTypeSelectorProps {
    options: NotificationTypeOption[];
    selectedType: NotificationType;
    onSelect: (type: NotificationType) => void;
}

export default function NotificationTypeSelector({
    options,
    selectedType,
    onSelect,
}: NotificationTypeSelectorProps) {
    const selectedOption = options.find((option) => option.value === selectedType);

    return (
        <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-gray-700">
                NOTIFICATION TYPE
            </span>
            <div className="flex flex-wrap gap-2">
                {options.map((option) => (
                    <button
                        type="button"
                        key={option.value}
                        onClick={() => onSelect(option.value)}
                        className={`rounded-md px-4 py-2 text-sm ${
                            selectedType === option.value
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200 text-gray-700"
                        }`}
                    >
                        {capitalizeFirstLetter(option.value)}
                    </button>
                ))}
            </div>
            <span className="mt-1 text-[0.800rem] text-gray-600">
                {selectedOption?.label}
            </span>
        </div>
    );
}
