import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";

interface CalibrationCardContextValue {
    warningThreshold: number;
    criticalThreshold: number;
    installationHeight: number;

    setWarningThreshold: (value: number) => void;
    setCriticalThreshold: (value: number) => void;
    setInstallationHeight: (value: number) => void;

    isEditing: boolean;
    setIsEditing: (value: boolean) => void;

    handleSaveChanges: () => void;
}

const CalibrationCardContext = createContext<
    CalibrationCardContextValue | undefined
>(undefined);

export function CalibrationCardProvider({ children }: { children: ReactNode }) {
    const [warningThreshold, setWarningThreshold] = useState<number>(0);
    const [criticalThreshold, setCriticalThreshold] = useState<number>(0);
    const [installationHeight, setInstallationHeight] = useState<number>(0);

    const [isEditing, setIsEditing] = useState<boolean>(false);

    const handleSaveChanges = () => {
        // Implement save logic here
        setIsEditing(false);
    };

    const contextValue = useMemo(
        () => ({
            warningThreshold,
            criticalThreshold,
            installationHeight,
            setWarningThreshold,
            setCriticalThreshold,
            setInstallationHeight,
            isEditing,
            setIsEditing,
            handleSaveChanges,
        }),
        [warningThreshold, criticalThreshold, installationHeight, isEditing]
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
