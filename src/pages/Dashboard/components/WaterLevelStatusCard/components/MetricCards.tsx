import React from "react";
import type { SensorData } from "../../../../../lib/types/sensor";

type StatCardProps = {
    title: string;
    data: string | number;
    desc: string;
};

const StatCard = ({ title, data, desc }: StatCardProps): React.JSX.Element => {
    return (
        <div className="border w-full rounded-md bg-gray-100/60 border-gray-300 px-4 py-3">
            <p className="text-sm font-medium text-gray-700">{title}</p>
            <p className="text-xl font-medium">{data}</p>
            <p className="text-xs text-gray-400">{desc}</p>
        </div>
    );
};

export default function MetricCards({
    sensorData,
}: {
    sensorData: SensorData | null;
}): React.JSX.Element {
    const getTitleAndDesc = (): { title: string; desc: string } => {
        switch (sensorData?.alert.level) {
            case "normal":
                return {
                    title: "To Warning",
                    desc: "cm remaining",
                };
            case "warning":
                return {
                    title: "To Critical",
                    desc: "cm remaining",
                };
            case "critical":
                return {
                    title: "Above Critical",
                    desc: "cm over",
                };
            default:
                return {
                    title: "To Warning",
                    desc: "cm remaining",
                };
        }
    };

    const titleAndDesc = getTitleAndDesc();

    return (
        <div className="flex flex-col justify-between ml-10 gap-1 flex-1">
            <StatCard
                title="Change Rate"
                data={sensorData?.waterLevel.change_rate_cm_per_min || 0}
                desc="cm/min"
            />
            <StatCard
                title={titleAndDesc.title}
                data={sensorData?.waterLevel.change_rate_cm_per_min || 0}
                desc={titleAndDesc.desc}
            />
        </div>
    );
}
