import { ArrowRight } from "lucide-react";
import type { ElementType } from "react";

interface CompactMetricCardProps {
    icon: ElementType;
    label: string;
    minValue: number;
    maxValue: number;
    unit: string;
    iconColor: string;
}

export default function CompactMetricCard({
    icon: Icon,
    label,
    minValue,
    maxValue,
    unit,
    iconColor,
}: CompactMetricCardProps) {
    return (
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg ${iconColor}`}>
                    <Icon className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium text-neutral">
                    {label}
                </span>
            </div>
            <div className="flex items-center justify-between">
                <div className="text-center">
                    <p className="text-xs text-gray-400 mb-1">Min</p>
                    <p className="text-lg font-semibold text-neutral">
                        {minValue}
                    </p>
                    <p className="text-[10px] text-gray-400">{unit}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-300" />
                <div className="text-center">
                    <p className="text-xs text-gray-400 mb-1">Max</p>
                    <p className="text-lg font-semibold text-neutral">
                        {maxValue}
                    </p>
                    <p className="text-[10px] text-gray-400">{unit}</p>
                </div>
            </div>
        </div>
    );
}
