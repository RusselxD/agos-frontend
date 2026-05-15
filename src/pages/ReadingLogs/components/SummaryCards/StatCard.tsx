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
        <div className="bg-white dark:bg-slate-800 custom-shadow rounded-xl p-4 flex items-center gap-4 border border-gray-100 dark:border-slate-700/50 transition-colors">
            <div className={`p-3 rounded-lg ${bgColorClass} dark:bg-opacity-20`}>
                <Icon className={`w-6 h-6 ${colorClass} dark:opacity-90`} />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 dark:text-slate-400 font-medium uppercase tracking-wide">
                    {label}
                </p>
                <p className={`text-xl font-bold ${colorClass} dark:opacity-90 truncate`}>
                    {value}
                </p>
                {subValue && (
                    <p className="text-xs text-gray-400 dark:text-slate-500 truncate">{subValue}</p>
                )}
            </div>
        </div>
    );
}
