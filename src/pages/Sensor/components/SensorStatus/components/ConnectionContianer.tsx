import { Power } from "lucide-react";
import type { CardProps } from "../SensorStatus";
import StatusCard, { StatusText } from "./StatusCard";

function getConnectionColors(status: string): string {
    const statusLower = status.toLowerCase();

    const colorMap: Record<string, string> = {
        online: "border-green-500 bg-green-50 text-green-700 dark:border-emerald-500/50 dark:bg-emerald-900/20 dark:text-emerald-400",
        warning: "border-yellow-500 bg-yellow-50 text-yellow-700 dark:border-yellow-500/50 dark:bg-yellow-900/20 dark:text-yellow-400",
        offline: "border-gray-400 bg-gray-100 text-gray-700 dark:border-slate-600 dark:bg-slate-700/50 dark:text-slate-300",
    };

    return colorMap[statusLower] || colorMap.offline;
}

function getIconColor(status: string): string {
    const statusLower = status.toLowerCase();

    const colorMap: Record<string, string> = {
        online: "bg-green-100 dark:bg-emerald-900/40",
        warning: "bg-yellow-100 dark:bg-yellow-900/40",
        offline: "bg-gray-100 dark:bg-slate-700",
    };

    return colorMap[statusLower] || colorMap["default"];
}

export default function ConnectionContainer({ value }: CardProps) {
    return (
        <StatusCard
            icon={
                <Power className={`p-2 rounded-md ${getIconColor(value)} text-current w-8 h-8`} />
            }
            title="Connection"
            className={getConnectionColors(value)}
        >
            <StatusText text={value} />
        </StatusCard>
    );
}
