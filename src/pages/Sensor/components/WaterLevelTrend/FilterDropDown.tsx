import { ChevronDown, ListFilter } from "lucide-react";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
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
    const [optionsVisible, setOptionsVisible] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    // Close dropdown when the whole component is not hovered
    useEffect(() => {
        if (!isHovered && optionsVisible) {
            setOptionsVisible(false);
        }
    }, [isHovered, optionsVisible]);

    return (
        <div
            className="absolute top-2 right-2 pb-1 z-20"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <button
                className="bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 shadow-sm btn-custom rounded-md border border-gray-400 dark:border-slate-600 text-gray-700 dark:text-slate-200 px-3 py-2 text-xs flex items-center justify-center transition-all duration-200"
                style={{ gap: isHovered ? "12px" : "0" }}
                onClick={() => setOptionsVisible((prev) => !prev)}
            >
                <ListFilter className="flex-shrink-0 w-4 h-4" />
                <span
                    className="overflow-hidden transition-all duration-200 whitespace-nowrap"
                    style={{ maxWidth: isHovered ? "200px" : "0" }}
                >
                    {selectedRange.label}
                </span>

                <ChevronDown
                    className={`flex-shrink-0 w-4 h-4 transition-all duration-200 ${optionsVisible ? "rotate-180" : ""}`}
                    style={{
                        opacity: isHovered ? 1 : 0,
                        width: isHovered ? "18px" : "0",
                    }}
                />
            </button>
            <div
                className={`absolute shadow-md top-full z-40 overflow-hidden bg-white dark:bg-slate-800 rounded-lg w-36 right-0 transition-[max-height] duration-150 ease-in-out border border-transparent dark:border-slate-700/50 mt-1 ${optionsVisible ? "max-h-96" : "max-h-0"}`}
            >
                <div className="rounded-lg bg-white dark:bg-slate-800">
                    {timeRanges.map((range, i) => (
                        <div
                            key={i}
                            onClick={() => {
                                if (isFetching) return;

                                setSelectedRange(range);
                                setOptionsVisible(false);
                            }}
                            className={`px-4 py-2 flex items-center gap-2 text-sm transition-colors ${selectedRange.label === range.label ? "bg-gray-100 dark:bg-slate-700 text-black dark:text-white font-medium" : "hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-700/50 cursor-pointer text-gray-700 dark:text-slate-300"}`}
                        >
                            <span>{range.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
