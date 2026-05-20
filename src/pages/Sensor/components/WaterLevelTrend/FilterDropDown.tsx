import { Check, ChevronDown } from "lucide-react";
import {
    useEffect,
    useRef,
    useState,
    type Dispatch,
    type SetStateAction,
} from "react";
import type { TimeRange } from "./WaterLevelTrendContainer";
import { timeRanges } from "./WaterLevelTrendContainer";

interface FilterDropDownProps {
    isFetching?: boolean;
    selectedRange: TimeRange;
    setSelectedRange: Dispatch<SetStateAction<TimeRange>>;
}

export default function FilterDropDown({
    isFetching,
    selectedRange,
    setSelectedRange,
}: FilterDropDownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen) return;
        const handleClickOutside = (e: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(e.target as Node)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    return (
        <div ref={containerRef} className="absolute top-2 right-2 z-20">
            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                className={`flex items-center justify-between gap-2 min-w-[120px] bg-white dark:bg-slate-900 border rounded-lg px-3 py-2 text-xs font-medium text-neutral dark:text-slate-200 transition-all duration-200 hover:border-primary/40 dark:hover:border-blue-500/40 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-blue-500/20 ${
                    isOpen
                        ? "border-primary dark:border-blue-500 shadow-sm ring-2 ring-primary/20 dark:ring-blue-500/20"
                        : "border-gray-200 dark:border-slate-700"
                }`}
            >
                <span>{selectedRange.label}</span>
                <ChevronDown
                    className={`w-4 h-4 text-gray-400 dark:text-slate-500 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                    }`}
                />
            </button>

            {isOpen && (
                <div className="absolute top-full right-0 mt-1 min-w-[140px] bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-lg overflow-hidden">
                    {timeRanges.map((range) => {
                        const isSelected =
                            selectedRange.label === range.label;
                        return (
                            <button
                                key={range.label}
                                type="button"
                                disabled={isFetching}
                                onClick={() => {
                                    if (isFetching) return;
                                    setSelectedRange(range);
                                    setIsOpen(false);
                                }}
                                className={`w-full flex items-center justify-between gap-2 px-3 py-2 text-xs text-left transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed ${
                                    isSelected
                                        ? "bg-primary/5 dark:bg-blue-500/10 text-primary dark:text-blue-400 font-medium"
                                        : "text-neutral dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700/50"
                                }`}
                            >
                                <span>{range.label}</span>
                                {isSelected && (
                                    <Check className="w-4 h-4 text-primary" />
                                )}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
