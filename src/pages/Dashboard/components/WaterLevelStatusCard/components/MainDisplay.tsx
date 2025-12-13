import React from "react";
import "../style.css";

import { ArrowDown, ArrowRight, ArrowUp, type LucideIcon } from "lucide-react";
import { useWaterLevel } from "../../../../../context/WaterLevelContext";

const capitalizeFirstLetter = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

const AlertCapsule = (): React.JSX.Element => {
    const { sensorData } = useWaterLevel();
    const alert = sensorData?.alert.level || "";

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

const LevelInfo = (): React.JSX.Element => {
    const { sensorData } = useWaterLevel();
    const level = sensorData?.waterLevel.trend || "stable";

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

const GaugeDisplay = () => {
    const { sensorConfig, sensorData } = useWaterLevel();

    if (!sensorConfig || !sensorData) {
        return <div className="water-gauge" />;
    }

    const warningPercentage =
        (sensorConfig.warning_cm / sensorConfig.critical_cm) * 100;

    return (
        <div className="water-gauge">
            <div
                className="threshold-marker warning"
                style={{ bottom: `${warningPercentage}%` }}
            />

            <div
                className="threshold-marker critical"
                style={{ bottom: "100%" }}
            />

            <div
                className="water-fill"
                style={{
                    height: `${Math.min(
                        sensorData.alert.percentage_of_critical,
                        100
                    )}%`,
                }}
            >
                <div className="wave-container">
                    <svg
                        className="wave wave1"
                        viewBox="0 0 100 20"
                        preserveAspectRatio="none"
                    >
                        <path d="M0,10 Q12.5,5 25,10 T50,10 T75,10 T100,10 L100,20 L0,20 Z" />
                    </svg>
                    <svg
                        className="wave wave2"
                        viewBox="0 0 100 20"
                        preserveAspectRatio="none"
                    >
                        <path d="M0,10 Q12.5,15 25,10 T50,10 T75,10 T100,10 L100,20 L0,20 Z" />
                    </svg>
                    <svg
                        className="wave wave2"
                        viewBox="0 0 100 20"
                        preserveAspectRatio="none"
                    >
                        <path d="M0,10 Q12.5,15 25,10 T50,10 T75,10 T100,10 L100,20 L0,20 Z" />
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default function MainDisplay(): React.JSX.Element {
    const { sensorData } = useWaterLevel();

    return (
        <div className="flex  items-center gap-2">
            <GaugeDisplay />
            <div className="space-y-2">
                <p>
                    <span className="text-3xl font-semibold">
                        {`${sensorData?.waterLevel.current_cm} `}
                    </span>
                    <span>cm</span>
                </p>
                <AlertCapsule />
                <LevelInfo />
            </div>
        </div>
    );
}
