import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
    type ReactNode,
} from "react";
import type { SensorData, SensorConfig } from "../types/sensor";
import { sensorAPI } from "../lib/api/sensor";

interface WaterLevelContextValue {
    sensorData: SensorData | null;
    sensorConfig: SensorConfig | null;

    isFetchingData: boolean;
    isFetchingConfig: boolean;

    error: string | null;
}

const WaterLevelContext = createContext<WaterLevelContextValue | undefined>(
    undefined
);

export function WaterLevelProvider({
    children,
}: {
    children: ReactNode;
}): React.JSX.Element {
    const [sensorData, setSensorData] = useState<SensorData | null>(null);
    const [sensorConfig, setSensorConfig] = useState<SensorConfig | null>(
        null
    );

    const [isFetchingData, setIsFetchingData] = useState<boolean>(true);
    const [isFetchingConfig, setIsFetchingConfig] = useState<boolean>(true);

    const [error, setError] = useState<string | null>(null);

    const isFirstFetch = useRef(true);

    // Fetch config data on mount
    useEffect(() => {
        const fetchSensorConfig = async () => {
            try {
                setIsFetchingConfig(true);
                const config = await sensorAPI.getSensorConfig();
                setSensorConfig(config);
            } catch (error) {
                setError("Failed to fetch sensor configuration");
            } finally {
                setIsFetchingConfig(false);
            }
        };
        fetchSensorConfig();
    }, []);

    // Fetch latest sensor data periodically
    useEffect(() => {
        const fetchSensorData = async () => {
            try {
                if (isFirstFetch.current) {
                    setIsFetchingData(true);
                    isFirstFetch.current = false;
                }

                const data = await sensorAPI.getLatestSensorData();

                setSensorData(data);
            } catch (error) {
                setError("Failed to fetch sensor data");
            } finally {
                setIsFetchingData(false);
            }
        };
        fetchSensorData();

        const intervalId = setInterval(fetchSensorData, 10 * 1000); // every 60 seconds
        return () => clearInterval(intervalId);
    }, []);

    const contextValue = useMemo(
        () => ({
            sensorData,
            sensorConfig,
            isFetchingData,
            isFetchingConfig,
            error,
        }),
        [sensorData, sensorConfig, isFetchingData, isFetchingConfig, error]
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
            "useWaterLevel must be used within a WaterLevelProvider"
        );
    }
    return context;
};
