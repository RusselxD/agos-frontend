import React from "react";
import type { SensorData } from "../../../../../lib/types/sensor";

import { ArrowDown, ArrowRight, ArrowUp, type LucideIcon } from "lucide-react";

const capitalizeFirstLetter = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

const AlertCapsule = ({ alert }: { alert: string }): React.JSX.Element => {
    const getAlertClasses = (alert: string) => {
        switch (alert) {
            case "normal":
                return {
                    bg: "bg-green-100",
                    circle: "bg-green-600",
                    text: "text-green-700",
                };
            case "warning":
                return {
                    bg: "bg-yellow-100",
                    circle: "bg-yellow-600",
                    text: "text-yellow-700",
                };
            case "critical":
                return {
                    bg: "bg-red-100",
                    circle: "bg-red-600",
                    text: "text-red-700",
                };
            default:
                return {
                    bg: "bg-gray-100",
                    circle: "bg-gray-600",
                    text: "text-gray-700",
                };
        }
    };

    const classes = getAlertClasses(alert);

    return (
        <div
            className={`flex rounded-full px-3 items-center gap-2 py-2 ${classes.bg}`}
        >
            <span className={`w-3 h-3 rounded-full ${classes.circle}`}></span>
            <span className={`text-sm ${classes.text}`}>
                {capitalizeFirstLetter(alert)}
            </span>
        </div>
    );
};

const LevelInfo = ({ level }: { level: string }): React.JSX.Element => {
    const getArrowDirection = (level: string): LucideIcon => {
        switch (level) {
            case "rising":
                return ArrowUp;
            case "falling":
                return ArrowDown;
            case "stable":
                return ArrowRight;
            default:
                return ArrowRight;
        }
    };

    const ArrowIcon = getArrowDirection(level || "stable");

    return (
        <div className="flex items-center gap-1">
            <ArrowIcon size={16} />
            <span className="">{capitalizeFirstLetter(level || "")}</span>
        </div>
    );
};

export default function MainDisplay({
    sensorData,
}: {
    sensorData: SensorData | null;
}): React.JSX.Element {
    return (
        <div className="flex  items-center gap-2">
            {/* Capsule */}
            <div className="w-10 bg-gray-400 rounded-full h-3/4"></div>
            <div className="space-y-2">
                <span>
                    <span className="text-3xl font-semibold">
                        {sensorData?.waterLevel.current_cm}
                    </span>
                    <span> cm</span>
                </span>
                <AlertCapsule alert={sensorData?.alert.level || ""} />
                <LevelInfo level={sensorData?.waterLevel.trend || ""} />
            </div>
        </div>
    );
}
