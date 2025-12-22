import {
    useState,
    useRef,
    useEffect,
    useMemo,
    createContext,
    useContext,
    type ReactNode,
} from "react";
import type { WeatherData } from "../types/weather";
import { fetchWeatherData } from "../lib/api/weather";

interface WeatherContextValue {
    weatherData: WeatherData | null;
    isFetching: boolean;
    error: string | null;
}

const WeatherContext = createContext<WeatherContextValue | undefined>(
    undefined
);

export function WeatherProvider({ children }: { children: ReactNode }) {
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [isFetching, setIsFetching] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const isFirstFetch = useRef(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (isFirstFetch.current) {
                    setIsFetching(true);
                    isFirstFetch.current = false;
                }

                const weatherData: WeatherData = await fetchWeatherData({
                    sensor_id: 1,
                });

                setWeatherData(weatherData);
            } catch (error) {
                setError("Failed to fetch weather data");
            } finally {
                setIsFetching(false);
            }
        };

        // Initial fetch
        fetchData();

        // Set up interval to fetch every 60 minutes
        const intervalId = setInterval(fetchData, 60 * 60 * 1000);

        return () => clearInterval(intervalId);
    }, []);

    const contextValue = useMemo(
        () => ({
            weatherData,
            isFetching,
            error,
        }),
        [weatherData, isFetching, error]
    );

    return (
        <WeatherContext.Provider value={contextValue}>
            {children}
        </WeatherContext.Provider>
    );
}

export const useWeather = () => {
    const context = useContext(WeatherContext);
    if (context === undefined) {
        throw new Error("useWeather must be used within a WeatherProvider");
    }
    return context;
};
