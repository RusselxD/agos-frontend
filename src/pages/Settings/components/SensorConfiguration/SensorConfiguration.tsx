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
            className={`flex items-start gap-3 rounded-md border p-3 sm:items-center sm:gap-5 ${className}`}
        >
            {icon}
            <div className="min-w-0 flex-1 space-y-1">
                <h2 className="text-sm font-semibold leading-tight sm:text-base">
                    {title}
                </h2>
                <p className="text-xs leading-5 text-gray-600 sm:text-sm">
                    {desc}
                </p>
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
        <div className="flex w-full items-center gap-2">
            <input
                type="number"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm sm:text-base"
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
        <p className="w-full max-w-56 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm sm:text-base">{`${height} cm`}</p>
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
                <Gauge className="h-10 w-10 shrink-0 rounded-md bg-blue-100 p-2.5 text-blue-600 sm:h-14 sm:w-14 sm:p-4" />
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
                <Bell className="h-10 w-10 shrink-0 rounded-md bg-yellow-100 p-2.5 text-yellow-600 sm:h-14 sm:w-14 sm:p-4" />
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
                <AlertTriangle className="h-10 w-10 shrink-0 rounded-md bg-red-100 p-2.5 text-red-600 sm:h-14 sm:w-14 sm:p-4" />
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
                <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
                    <div className="skeleton h-24 w-full rounded-md sm:h-28"></div>
                    <div className="skeleton h-24 w-full rounded-md sm:h-28"></div>
                    <div className="skeleton h-24 w-full rounded-md sm:h-28"></div>
                </div>
                <div className="flex justify-end">
                    <div className="skeleton mt-3 h-10 w-full rounded-md sm:h-12 sm:w-40"></div>
                </div>
            </Container>
        );
    }

    return (
        <Container headerTitle="SENSOR CONFIGURATION">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <InstallationHeightCard />
                <WarningThresholdCard />
                <CriticalThresholdCard />
                <div className="flex flex-col gap-2 text-sm font-medium md:col-span-3 md:flex-row md:justify-end">
                    {isEditing ? (
                        <>
                            <button
                                onClick={() => setIsEditing(false)}
                                disabled={isSaving}
                                className="btn-cancel py-2.5 sm:py-3"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleSaveChanges()}
                                disabled={isSaving}
                                className="btn-custom bg-primary py-2.5 text-white hover:bg-primary/90 disabled:hover:bg-primary sm:py-3"
                            >
                                {isSaving ? "Saving..." : "Save Changes"}
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="btn-custom bg-primary py-2.5 text-white hover:bg-primary/90 sm:py-3"
                        >
                            Edit Configuration
                        </button>
                    )}
                </div>
            </div>
        </Container>
    );
}
