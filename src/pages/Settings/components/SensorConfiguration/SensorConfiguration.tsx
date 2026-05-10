import { AlertTriangle, Bell, Gauge } from "lucide-react";
import type { ReactNode } from "react";
import { useCalibrationCard } from "./CalibrationCardContext";

import Container from "../../../../components/ui/Container";

interface ThresholdCardProps {
    title: string;
    desc: string;
    icon: ReactNode;
    className?: string;
    children?: ReactNode;
}

const ThresholdCard = ({
    title,
    desc,
    icon,
    className,
    children,
}: ThresholdCardProps) => {
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

const HeightInput = ({
    height,
    config,
}: {
    height: number | undefined;
    config: string;
}) => {
    const { handleUpdateConfig } = useCalibrationCard();

    return (
        <div className="flex items-center w-full gap-2">
            <input
                type="number"
                className="px-3 py-2 w-full rounded-md border border-gray-300"
                value={height ?? ""}
                onChange={(e) =>
                    handleUpdateConfig(config, e.target.valueAsNumber)
                }
            />
            <span>cm</span>
        </div>
    );
};

const HeightDisplay = ({ height }: { height: number | undefined }) => {
    return (
        <p className="px-3 py-2 w-3/4 rounded-md bg-white border border-gray-300">{`${height} cm`}</p>
    );
};

const InstallationHeightCard = () => {
    // 1. User clicks "Auto" button
    // 2. Frontend sends request to Raspberry Pi API
    // 3. Pi triggers ultrasonic sensor to take reading
    // 4. Sensor returns distance (e.g., 150cm to canal bottom)
    // 5. Pi sends this value back to frontend
    // 6. Frontend auto-fills the Installation Height field

    const { isEditing, originalConfig, newConfig } = useCalibrationCard();

    return (
        <ThresholdCard
            className="bg-gray-50 border-gray-300"
            title="Installation Height"
            desc="Distance from sensor to the bottom"
            icon={
                <Gauge className="shrink-0 p-4 rounded-md bg-blue-100 text-blue-600 w-14 h-14" />
            }
        >
            <div>
                {isEditing ? (
                    <HeightInput
                        height={newConfig?.installation_height}
                        config="installation_height"
                    />
                ) : (
                    <HeightDisplay
                        height={originalConfig?.installation_height}
                    />
                )}
            </div>
        </ThresholdCard>
    );
};

const WarningThresholdCard = () => {
    const { isEditing, originalConfig, newConfig } = useCalibrationCard();

    return (
        <ThresholdCard
            className="bg-yellow-50 border-yellow-300"
            title="Warning Threshold"
            desc="Early warning water level depth"
            icon={
                <Bell className="shrink-0 p-4 rounded-md bg-yellow-100 text-yellow-600 w-14 h-14" />
            }
        >
            <div>
                {isEditing ? (
                    <HeightInput
                        height={newConfig?.warning_threshold}
                        config="warning_threshold"
                    />
                ) : (
                    <HeightDisplay height={originalConfig?.warning_threshold} />
                )}
            </div>
        </ThresholdCard>
    );
};

const CriticalThresholdCard = () => {
    const { isEditing, originalConfig, newConfig } = useCalibrationCard();

    return (
        <ThresholdCard
            className="bg-red-50 border-red-300"
            title="Critical Threshold"
            desc="Maximum safe water level depth"
            icon={
                <AlertTriangle className="shrink-0 p-4 rounded-md bg-red-100 text-red-600 w-14 h-14" />
            }
        >
            <div>
                {isEditing ? (
                    <HeightInput
                        height={newConfig?.critical_threshold}
                        config="critical_threshold"
                    />
                ) : (
                    <HeightDisplay
                        height={originalConfig?.critical_threshold}
                    />
                )}
            </div>
        </ThresholdCard>
    );
};

export default function SensorConfiguration() {
    const { isFetching, isSaving, isEditing, setIsEditing, handleSaveChanges } =
        useCalibrationCard();

    if (isFetching) {
        return (
            <Container headerTitle="SENSOR CONFIGURATION">
                <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="skeleton rounded-md w-full h-28"></div>
                    <div className="skeleton rounded-md w-full h-28"></div>
                    <div className="skeleton rounded-md w-full h-28"></div>
                </div>
                <div className="flex justify-end">
                    <div className="skeleton rounded-md w-40 h-12 mt-3"></div>
                </div>
            </Container>
        );
    }

    return (
        <Container headerTitle="SENSOR CONFIGURATION">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <InstallationHeightCard />
                <WarningThresholdCard />
                <CriticalThresholdCard />
                <div className="flex flex-col md:flex-row gap-2 font-medium md:col-span-3 md:justify-end">
                    {isEditing ? (
                        <>
                            <button
                                onClick={() => setIsEditing(false)}
                                disabled={isSaving}
                                className="btn-cancel"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleSaveChanges()}
                                disabled={isSaving}
                                className="btn-custom bg-primary text-white hover:bg-primary/90 disabled:hover:bg-primary"
                            >
                                {isSaving ? "Saving..." : "Save Changes"}
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="btn-custom bg-primary text-white hover:bg-primary/90"
                        >
                            Edit Configuration
                        </button>
                    )}
                </div>
            </div>
        </Container>
    );
}
