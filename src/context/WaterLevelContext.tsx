import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react";
import type {
    SensorData,
    SensorConfig,
    SensorReadingSummaryResponse,
} from "../types/sensor";
import { sensorAPI } from "../lib/api/sensor";
import { useWebSocketMessage } from "./WebSocketContext";
import { useCoreHook } from "./CoreContext";

interface WaterLevelContextValue {
    sensorData: SensorData | null;
    sensorConfig: SensorConfig | null;

    isFetching: boolean;
    isFetchingConfig: boolean;

    warning: string | null;
    error: string | null;
}

const WaterLevelContext = createContext<WaterLevelContextValue | undefined>(
    undefined,
);

export function WaterLevelProvider({
    children,
}: {
    children: ReactNode;
}): React.JSX.Element {
    const [sensorData, setSensorData] = useState<SensorData | null>(null);
    const [sensorConfig, setSensorConfig] = useState<SensorConfig | null>(null);

    const [isFetching, setIsFetching] = useState<boolean>(true);
    const [isFetchingConfig, setIsFetchingConfig] = useState<boolean>(true);

    const [warning, setWarning] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const { sensorDeviceDetails } = useCoreHook();

    // Fetch config data on mount
    useEffect(() => {
        const fetchSensorConfig = async () => {
            try {
                setIsFetchingConfig(true);
                const config = await sensorAPI.getSensorConfig(
                    sensorDeviceDetails.sensor_device_id,
                );
                setSensorConfig(config);
            } catch (error) {
                console.log(error);
                setError("Failed to fetch sensor configuration");
            } finally {
                setIsFetchingConfig(false);
            }
        };
        fetchSensorConfig();
    }, []);

    // WebSocket message handler for sensor updates
    useWebSocketMessage(
        "sensor_update",
        (data: SensorReadingSummaryResponse) => {
            setIsFetching(false);

            if (data.status == "error") {
                setError(data.message);
                setWarning(null);
                setSensorData(null);
                return;
            }

            if (data.status == "warning") {
                setWarning(data.message);
                setError(null);
                setSensorData(data.sensor_reading);
                return;
            }

            setError(null);
            setWarning(null);
            setSensorData(data.sensor_reading);
        },
    );

    const contextValue = useMemo(
        () => ({
            sensorData,
            sensorConfig,
            isFetching,
            isFetchingConfig,
            warning,
            error,
        }),
        [
            sensorData,
            sensorConfig,
            isFetching,
            isFetchingConfig,
            warning,
            error,
        ],
    );

    return (
        <WaterLevelContext.Provider value={contextValue}>
            {children}
        </WaterLevelContext.Provider>
    );
}

export const useWaterLevel = () => {
    const context = useContext(WaterLevelContext);
    if (context === undefined) {
        throw new Error(
            "useWaterLevel must be used within a WaterLevelProvider",
        );
    }
    return context;
};
