import { Power } from "lucide-react";
import type { CardProps } from "../SensorStatus";
import StatusCard, { StatusText } from "./StatusCard";

function getConnectionColors(status: string): string {
    const statusLower = status.toLowerCase();

    const colorMap: Record<string, string> = {
        online: "border-green-500 bg-green-50 text-green-700",
        warning: "border-yellow-500 bg-yellow-50 text-yellow-700",
        offline: "border-gray-400 bg-gray-100 text-gray-700",
    };

    return colorMap[statusLower] || colorMap.offline;
}

function getIconColor(status: string): string {
    const statusLower = status.toLowerCase();

    const colorMap: Record<string, string> = {
        online: "bg-green-100",
        warning: "bg-yellow-100",
        offline: "bg-gray-100",
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
