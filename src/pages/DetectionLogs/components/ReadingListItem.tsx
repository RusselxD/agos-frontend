import { CircleAlert, CircleCheck, TriangleAlert, Trash2 } from "lucide-react";
import type { ModelReadingListItem } from "../../../types/modelReadingLog";
import { format } from "date-fns";

const STATUS_CONFIG: Record<string, { icon: typeof CircleCheck; className: string; label: string; badge: string }> = {
    clear: { icon: CircleCheck, className: "text-emerald-600", label: "Clear", badge: "bg-emerald-100 text-emerald-700" },
    partial: { icon: TriangleAlert, className: "text-amber-500", label: "Partial", badge: "bg-amber-100 text-amber-700" },
    blocked: { icon: CircleAlert, className: "text-red-500", label: "Blocked", badge: "bg-red-100 text-red-700" },
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
            className={`w-full text-left p-3.5 rounded-lg border transition-colors ${
                isSelected
                    ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
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

            <div className="flex items-center gap-3 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                    <Trash2 className="w-3 h-3" />
                    {reading.total_debris_count} debris
                </span>
                <span className="text-[0.68rem] text-gray-400">
                    {format(new Date(reading.timestamp), "MMM d, yyyy 'at' h:mm a")}
                </span>
            </div>
        </button>
    );
}
