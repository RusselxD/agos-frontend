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
        <div className="bg-white/60 dark:bg-white/[0.03] backdrop-blur-xl shadow-lg rounded-2xl p-5 flex items-center gap-5 border border-white/50 dark:border-white/10 transition-all duration-300 hover:shadow-xl hover:dark:border-white/20">
            <div className={`p-3.5 rounded-xl ${bgColorClass} dark:bg-opacity-20 shadow-inner`}>
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
