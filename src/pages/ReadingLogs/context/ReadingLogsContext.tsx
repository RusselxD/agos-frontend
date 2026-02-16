import {
    createContext,
    useContext,
    useState,
    useMemo,
    useEffect,
    useRef,
} from "react";
import type { DailySummary } from "../../../types/readingLogs";
import { readingLogsAPI } from "../../../lib/api/readingLogs";
import { useCoreHook } from "../../../context/CoreContext";
import { useToast } from "../../../context/ToastContext";

interface ReadingLogsContextValue {
    startDate: string;
    endDate: string;
    setStartDate: (date: string) => void;
    setEndDate: (date: string) => void;
    availableDays: string[];

    summaries: DailySummary[];
    isLoading: boolean;
}

const ReadingLogsContext = createContext<ReadingLogsContextValue | undefined>(
    undefined,
);

export function ReadingLogsProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [availableDays, setAvailableDays] = useState<string[]>([]);

    const [summaries, setSummaries] = useState<DailySummary[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const initialFetchDone = useRef(false);
    const prevDatesRef = useRef({ startDate: "", endDate: "" });

    const { locationDetails } = useCoreHook();
    const { toastError } = useToast();

    // Initial fetch to get available days and set default date range
    useEffect(() => {
        const initialFetch = async () => {
            try {
                setIsLoading(true);
                const days = await readingLogsAPI.getAvailableDays(
                    locationDetails.location_id,
                );
                setAvailableDays(days);

                if (days.length > 0) {
                    const earliestDate = days[0];
                    const latestDate = days[days.length - 1];

                    setStartDate(earliestDate);
                    setEndDate(latestDate);
                    prevDatesRef.current = {
                        startDate: earliestDate,
                        endDate: latestDate,
                    };

                    const summariesData =
                        await readingLogsAPI.getDailySummaries(
                            locationDetails.location_id,
                            earliestDate,
                            latestDate,
                        );
                    setSummaries(summariesData);
                } else {
                    setSummaries([]);
                }
            } catch (error) {
                toastError("Failed to fetch reading logs");
            } finally {
                setIsLoading(false);
                initialFetchDone.current = true;
            }
        };

        initialFetch();
    }, [locationDetails.location_id]);

    // Fetch summaries when date range changes (only after initialization and if dates actually changed)
    useEffect(() => {
        if (!initialFetchDone.current || !startDate || !endDate) return;

        // Skip if dates haven't actually changed
        if (
            prevDatesRef.current.startDate === startDate &&
            prevDatesRef.current.endDate === endDate
        ) {
            return;
        }

        prevDatesRef.current = { startDate, endDate };

        const fetchSummaries = async () => {
            setIsLoading(true);
            try {
                const summariesData = await readingLogsAPI.getDailySummaries(
                    locationDetails.location_id,
                    startDate,
                    endDate,
                );
                setSummaries(summariesData);
            } catch (error) {
                toastError("Failed to fetch reading logs");
            } finally {
                setIsLoading(false);
            }
        };

        fetchSummaries();
    }, [startDate, endDate, locationDetails.location_id]);

    const contextValue = useMemo(
        () => ({
            summaries,
            isLoading,
            startDate,
            endDate,
            setStartDate,
            setEndDate,
            availableDays,
        }),
        [summaries, isLoading, startDate, endDate, availableDays],
    );

    return (
        <ReadingLogsContext.Provider value={contextValue}>
            {children}
        </ReadingLogsContext.Provider>
    );
}

export const useReadingLogs = () => {
    const context = useContext(ReadingLogsContext);
    if (context === undefined) {
        throw new Error(
            "useReadingLogs must be used within a ReadingLogsProvider",
        );
    }
    return context;
};
