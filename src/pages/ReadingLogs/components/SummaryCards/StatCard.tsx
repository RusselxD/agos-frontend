import type { LucideIcon } from "lucide-react";

interface StatCardProps {
    icon: LucideIcon;
    label: string;
    value: string | number;
    subValue?: string;
    colorClass: string;
    bgColorClass: string;
}

export default function StatCard({
    icon: Icon,
    label,
    value,
    subValue,
    colorClass,
    bgColorClass,
}: StatCardProps) {
    return (
        <div className="bg-white custom-shadow rounded-xl p-4 flex items-center gap-4">
            <div className={`p-3 rounded-lg ${bgColorClass}`}>
                <Icon className={`w-6 h-6 ${colorClass}`} />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                    {label}
                </p>
                <p className={`text-xl font-bold ${colorClass} truncate`}>
                    {value}
                </p>
                {subValue && (
                    <p className="text-xs text-gray-400 truncate">{subValue}</p>
                )}
            </div>
        </div>
    );
}
