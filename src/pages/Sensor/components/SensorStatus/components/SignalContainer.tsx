import { Wifi } from "lucide-react";
import StatusCard, { StatusText } from "./StatusCard";
import { capitalizeFirstLetter } from "../../../../../lib/utils/formatter";
import type { CardProps } from "../SensorStatus";

function getSignalColors(status: string): string {
    const statusLower = status.toLowerCase();

    const colorMap: Record<string, string> = {
        excellent: "border-green-500 bg-green-50 text-green-700",
        good: "border-blue-500 bg-blue-50 text-blue-700",
        fair: "border-yellow-500 bg-yellow-50 text-yellow-700",
        poor: "border-red-500 bg-red-50 text-red-700",
        default: "border-gray-300 bg-gray-50 text-gray-700",
    };

    return colorMap[statusLower] || colorMap["default"];
}

function getIconColor(status: string): string {
    const statusLower = status.toLowerCase();

    const colorMap: Record<string, string> = {
        excellent: "bg-green-100",
        good: "bg-blue-100",
        fair: "bg-yellow-100",
        poor: "bg-red-100",
        default: "bg-gray-100",
    };

    return colorMap[statusLower] || colorMap["default"];
}

export default function SignalContainer({ value }: CardProps) {
    return (
        <StatusCard
            icon={
                <Wifi
                    className={`p-2 rounded-md ${getIconColor(value)} w-8 h-8`}
                />
            }
            title="Signal"
            className={getSignalColors(value)}
        >
            <StatusText text={value ? capitalizeFirstLetter(value) : "N/A"} />
        </StatusCard>
    );
}
