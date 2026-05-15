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
        <div className="relative" ref={dropdownRef}>
            {/* Label */}
            {label && (
                <span className="text-[10px] text-gray-400 dark:text-slate-500 uppercase tracking-wide mb-1 block">
                    {label}
                </span>
            )}

            {/* Trigger Button */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    flex items-center justify-between gap-2 min-w-[140px]
                    bg-white dark:bg-slate-900 border rounded-lg px-3 py-2
                    text-sm font-medium text-neutral dark:text-slate-200
                    transition-all duration-200
                    hover:border-primary/40 dark:hover:border-blue-500/40 hover:shadow-sm
                    focus:outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-blue-500/20 focus:border-primary dark:focus:border-blue-500
                    ${isOpen ? "border-primary dark:border-blue-500 shadow-sm ring-2 ring-primary/20 dark:ring-blue-500/20" : "border-gray-200 dark:border-slate-700"}
                `}
            >
                <span>{value ? formatDate(value) : "Select date"}</span>
                <ChevronDown
                    className={`w-4 h-4 text-gray-400 dark:text-slate-500 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                    }`}
                />
            </button>

            {/* Dropdown Panel */}
            {isOpen && (
                <div
                    className="
                        absolute right-0 z-50 mt-1 w-full min-w-[180px]
                        bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-lg
                        overflow-hidden animate-dropdown-in
                    "
                >
                    {/* Header */}
                    <div className="px-3 py-2 bg-gray-50 dark:bg-slate-800/80 border-b border-gray-100 dark:border-slate-700/50">
                        <p className="text-[10px] text-gray-500 dark:text-slate-400 uppercase tracking-wide font-medium">
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
                                                ? "bg-primary/5 dark:bg-blue-500/10 text-primary dark:text-blue-400 font-medium"
                                                : "text-neutral dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700/50"
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
