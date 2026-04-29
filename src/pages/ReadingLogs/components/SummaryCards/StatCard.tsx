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
        <div className="custom-shadow flex min-w-0 items-center gap-3 rounded-xl bg-white p-3 sm:gap-4 sm:p-4">
            <div className={`shrink-0 rounded-lg p-3 ${bgColorClass}`}>
                <Icon className={`h-6 w-6 ${colorClass}`} />
            </div>
            <div className="min-w-0 flex-1">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    {label}
                </p>
                <p className={`break-words text-xl font-bold leading-tight ${colorClass}`}>
                    {value}
                </p>
                {subValue && (
                    <p className="text-xs text-gray-400 truncate">{subValue}</p>
                )}
            </div>
        </div>
    );
}
