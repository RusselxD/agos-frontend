import { CircleAlert, CircleCheck, TriangleAlert } from "lucide-react";
import type { ModelReadingListItem } from "../../../types/modelReadingLog";
import { format } from "date-fns";

const STATUS_CONFIG: Record<string, { icon: typeof CircleCheck; className: string; label: string; badge: string }> = {
    clear: { icon: CircleCheck, className: "text-emerald-600 dark:text-emerald-400", label: "Clear", badge: "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 ring-1 ring-emerald-200 dark:ring-emerald-800/50" },
    partial: { icon: TriangleAlert, className: "text-amber-500 dark:text-amber-400", label: "Possible Surface Obstruction", badge: "bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 ring-1 ring-amber-200 dark:ring-amber-800/50" },
    blocked: { icon: CircleAlert, className: "text-red-500 dark:text-red-400", label: "Potential Surface Obstruction", badge: "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 ring-1 ring-red-200 dark:ring-red-800/50" },
};

interface Props {
    reading: ModelReadingListItem;
    isSelected: boolean;
    onClick: () => void;
}

export default function ReadingListItem({ reading, isSelected, onClick }: Props) {
    const config = STATUS_CONFIG[reading.blockage_status] ?? STATUS_CONFIG.clear;
    const StatusIcon = config.icon;

    return (
        <button
            onClick={onClick}
            className={`w-full text-left p-4 rounded-xl border transition-all duration-300 ${
                isSelected
                    ? "border-primary dark:border-blue-500 bg-primary/10 dark:bg-blue-500/10 ring-1 ring-primary/20 dark:ring-blue-500/20 shadow-lg scale-[1.01]"
                    : "border-gray-200/50 dark:border-white/5 bg-white/40 dark:bg-white/[0.02] hover:border-gray-300 dark:hover:border-white/20 hover:bg-white/60 dark:hover:bg-white/[0.05] hover:shadow-md"
            }`}
        >
            <div className="flex items-center justify-between mb-2">
                <span className={`text-[0.65rem] font-semibold uppercase px-2 py-0.5 rounded-full ${config.badge}`}>
                    {config.label}
                </span>
                <span className={`flex items-center gap-1 text-xs font-medium ${config.className}`}>
                    <StatusIcon className="w-3.5 h-3.5" />
                    {reading.blockage_percentage.toFixed(1)}%
                </span>
            </div>

            <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-slate-400">
                <span className="text-[0.68rem] text-gray-400 dark:text-slate-500 font-medium">
                    {format(new Date(reading.timestamp), "MMM d, yyyy 'at' h:mm a")}
                </span>
            </div>
        </button>
    );
}
