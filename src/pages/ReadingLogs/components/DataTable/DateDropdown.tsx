import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { formatDate } from "../../../../lib/utils/formatter";

interface DateDropdownProps {
    value: string;
    options: string[];
    onChange: (value: string) => void;
    label?: string;
}

export default function DateDropdown({
    value,
    options,
    onChange,
    label,
}: DateDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Close on escape key
    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsOpen(false);
            }
        };

        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, []);

    const handleSelect = (selectedValue: string) => {
        onChange(selectedValue);
        setIsOpen(false);
    };

    return (
        <div className="relative min-w-0" ref={dropdownRef}>
            {/* Label */}
            {label && (
                <span className="text-[10px] text-gray-400 uppercase tracking-wide mb-1 block">
                    {label}
                </span>
            )}

            {/* Trigger Button */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    flex w-full min-w-0 items-center justify-between gap-2 sm:min-w-[140px]
                    bg-white border rounded-lg px-3 py-2
                    text-sm font-medium text-neutral
                    transition-all duration-200
                    hover:border-primary/40 hover:shadow-sm
                    focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                    ${isOpen ? "border-primary shadow-sm ring-2 ring-primary/20" : "border-gray-200"}
                `}
            >
                <span className="min-w-0 truncate">
                    {value ? formatDate(value) : "Select date"}
                </span>
                <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                    }`}
                />
            </button>

            {/* Dropdown Panel */}
            {isOpen && (
                <div
                    className="
                        absolute left-0 z-50 mt-1 w-full min-w-[160px] sm:right-0 sm:left-auto sm:min-w-[180px]
                        bg-white border border-gray-200 rounded-xl shadow-lg
                        overflow-hidden animate-dropdown-in
                    "
                >
                    {/* Header */}
                    <div className="px-3 py-2 bg-gray-50 border-b border-gray-100">
                        <p className="text-[10px] text-gray-500 uppercase tracking-wide font-medium">
                            Available Dates
                        </p>
                    </div>

                    {/* Options List */}
                    <div className="max-h-[240px] overflow-y-auto">
                        {options.map((option) => {
                            const isSelected = option === value;
                            return (
                                <button
                                    key={option}
                                    type="button"
                                    onClick={() => handleSelect(option)}
                                    className={`
                                        w-full flex items-center justify-between gap-2
                                        px-3 py-2.5 text-sm text-left
                                        transition-colors duration-150
                                        ${
                                            isSelected
                                                ? "bg-primary/5 text-primary font-medium"
                                                : "text-neutral hover:bg-gray-50"
                                        }
                                    `}
                                >
                                    <span>{formatDate(option)}</span>
                                    {isSelected && (
                                        <Check className="w-4 h-4 text-primary" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
