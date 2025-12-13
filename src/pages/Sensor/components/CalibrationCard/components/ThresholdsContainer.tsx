import { AlertTriangle, Bell, Gauge } from "lucide-react";
import React from "react";
import { useCalibrationCard } from "../context/CalibrationCardContext";

interface ThresholdCardProps {
    title: string;
    desc: string;
    icon: React.ReactNode;
    className?: string;
    children?: React.ReactNode;
}

const ThresholdCard = ({
    title,
    desc,
    icon,
    className,
    children,
}: ThresholdCardProps): React.JSX.Element => {
    return (
        <div
            className={`rounded-md p-3 flex items-center gap-5 border ${className}`}
        >
            {icon}
            <div className="space-y-1 flex-1">
                <h2 className="font-semibold">{title}</h2>
                <p className="text-sm text-gray-600">{desc}</p>
                {children}
            </div>
        </div>
    );
};

const HeightDisplay = ({ height }: { height: number }): React.JSX.Element => {
    return (
        <p className="px-3 py-2 w-3/4 rounded-md bg-white border border-gray-300">{`${height} cm`}</p>
    );
};

const InstallationHeightCard = (): React.JSX.Element => {
    // 1. User clicks "Auto" button
    // 2. Frontend sends request to Raspberry Pi API
    // 3. Pi triggers ultrasonic sensor to take reading
    // 4. Sensor returns distance (e.g., 150cm to canal bottom)
    // 5. Pi sends this value back to frontend
    // 6. Frontend auto-fills the Installation Height field

    const { isEditing, installationHeight } = useCalibrationCard();

    return (
        <ThresholdCard
            className="bg-gray-50 border-gray-300"
            title="Installation Height"
            desc="Distance from sensor to the bottom"
            icon={
                <Gauge className="p-4 rounded-md bg-blue-100 text-blue-600 w-14 h-14" />
            }
        >
            <div>
                {isEditing ? null : (
                    <HeightDisplay height={installationHeight} />
                )}
            </div>
        </ThresholdCard>
    );
};

const WarningThresholdCard = (): React.JSX.Element => {
    const { isEditing, warningThreshold } = useCalibrationCard();

    return (
        <ThresholdCard
            className="bg-yellow-50 border-yellow-300"
            title="Warning Threshold"
            desc="Early warning water level depth"
            icon={
                <Bell className="p-4 rounded-md bg-yellow-100 text-yellow-600 w-14 h-14" />
            }
        >
            <div>
                {isEditing ? null : <HeightDisplay height={warningThreshold} />}
            </div>
        </ThresholdCard>
    );
};

const CriticalThresholdCard = (): React.JSX.Element => {
    const { isEditing, criticalThreshold } = useCalibrationCard();

    return (
        <ThresholdCard
            className="bg-red-50 border-red-300"
            title="Critical Threshold"
            desc="Maximum safe water level depth"
            icon={
                <AlertTriangle className="p-4 rounded-md bg-red-100 text-red-600 w-14 h-14" />
            }
        >
            <div>
                {isEditing ? null : (
                    <HeightDisplay height={criticalThreshold} />
                )}
            </div>
        </ThresholdCard>
    );
};

export default function ThresholdsContainer(): React.JSX.Element {
    const { isEditing, setIsEditing, handleSaveChanges } = useCalibrationCard();

    return (
        <div className="space-y-3">
            <h2 className="pl-2 border-l-4 font-semibold text-gray-600 border-primary">
                SENSOR CONFIGURATION
            </h2>
            <InstallationHeightCard />
            <WarningThresholdCard />
            <CriticalThresholdCard />
            <div className="flex gap-2 font-medium">
                {isEditing ? (
                    <>
                        <button
                            onClick={() => setIsEditing(false)}
                            className="custom-button bg-gray-200 hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => handleSaveChanges()}
                            className="custom-button hover:bg-primary/90 bg-primary text-white"
                        >
                            Save Changes
                        </button>
                    </>
                ) : (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="custom-button hover:bg-primary/90 bg-primary text-white"
                    >
                        Edit Configuration
                    </button>
                )}
            </div>
        </div>
    );
}
