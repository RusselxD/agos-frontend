import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { SensorConfig } from "../../../../../types/sensor";
import { sampleSensorAPI } from "../../../../../lib/api/sensor";

interface CalibrationCardContextValue {
    originalConfig: SensorConfig | null;
    newConfig: SensorConfig | null;
    handleUpdateConfig: (config: string, value: number) => void;

    isFetching: boolean;

    isEditing: boolean;
    setIsEditing: (value: boolean) => void;

    handleSaveChanges: () => void;
}

const CalibrationCardContext = createContext<
    CalibrationCardContextValue | undefined
>(undefined);

export function CalibrationCardProvider({ children }: { children: ReactNode }) {
    const [originalConfig, setOriginalConfig] = useState<SensorConfig | null>(
        null
    );

    const [newConfig, setNewConfig] = useState<SensorConfig | null>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isFetching, setIsFetching] = useState<boolean>(true);

    const handleUpdateConfig = (config: string, value: number) => {
        setNewConfig((prev) => (prev ? { ...prev, [config]: value } : null));
    };

    useEffect(() => {
        const fetchSensorConfig = async () => {
            try {
                setIsFetching(true);
                await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay
                const res = await sampleSensorAPI.getSensorConfig();                
                setOriginalConfig(res);
            } catch (error) {
            } finally {
                setIsFetching(false);
            }
        };
        fetchSensorConfig();
    }, []);

    // When entering edit mode, initialize newConfig with originalConfig
    useEffect(() => {
        if (isEditing) {
            setNewConfig(originalConfig);
        }
    }, [isEditing]);

    const handleSaveChanges = () => {
        // Implement save logic here
        setIsEditing(false);
    };

    const contextValue = useMemo(
        () => ({
            originalConfig,
            newConfig,
            handleUpdateConfig,
            isFetching,
            isEditing,
            setIsEditing,
            handleSaveChanges,
        }),
        [originalConfig, newConfig, isEditing, isFetching]
    );

    return (
        <CalibrationCardContext.Provider value={contextValue}>
            {children}
        </CalibrationCardContext.Provider>
    );
}

export const useCalibrationCard = () => {
    const context = useContext(CalibrationCardContext);
    if (!context) {
        throw new Error(
            "useCalibrationCard must be used within a CalibrationCardProvider"
        );
    }
    return context;
};
