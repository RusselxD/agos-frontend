import { Clock } from "lucide-react";
import { getTimeAgo } from "../../../../../lib/utils/formatter";
import StatusCard, { StatusText } from "./StatusCard";
import type { CardProps } from "../SensorStatus";

export default function LastUpdatedContainer({ value }: CardProps) {
    return (
        <StatusCard
            icon={
                <Clock className="p-2 rounded-md bg-blue-100 text-blue-600 w-8 h-8" />
            }
            title="Last Updated"
        >
            <StatusText text={value ? getTimeAgo(value) : "N/A"} />
        </StatusCard>
    );
};