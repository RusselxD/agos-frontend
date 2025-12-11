import {
    useState,
    useRef,
    useEffect,
    useMemo,
    createContext,
    useContext,
} from "react";
import type { WeatherData } from "../lib/types/weather";
import { getCurrentLocation } from "../lib/utils/getCurrentLocation";
import { fetchWeatherData } from "../lib/api/weather";

interface WeatherContextValue {
    weatherData: WeatherData | null;
    isFetching: boolean;
    error: string | null;
}

const WeatherContext = createContext<WeatherContextValue | undefined>(
    undefined
);

export function WeatherProvider({
    children,
}: {
    children: React.ReactNode;
}): React.JSX.Element {
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [isFetching, setIsFetching] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const isFirstFetch = useRef(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (isFirstFetch.current) {
                    setIsFetching(true);
                }

                let latitude = 14.69;
                let longitude = 121.97;
                try {
                    const location = await getCurrentLocation();
                    latitude = location.latitude;
                    longitude = location.longitude;
                } catch (error) {}

                const weatherData: WeatherData = await fetchWeatherData({
                    latitude: latitude || 14.69,
                    longitude: longitude || 121.97,
                });

                // Update state if there is new data
                if (weatherData) {
                    setWeatherData(weatherData);
                    isFirstFetch.current = false;
                }
            } catch (error) {
            } finally {
                setIsFetching(false);
            }
        };

        // Initial fetch
        fetchData();

        // Set up interval to fetch every 5 minutes
        const intervalId = setInterval(fetchData, 5 * 60 * 1000);

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
