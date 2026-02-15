import { createContext, useContext, useState, useMemo } from "react";
import type { DailySummary } from "../../../types/readingLogs";
import { readingLogsAPI } from "../../../lib/api/readingLogs";
import { useCoreHook } from "../../../context/CoreContext";
import { useToast } from "../../../context/ToastContext";

interface ReadingLogsContextValue {
    summaries: DailySummary[];
    isLoading: boolean;
    isFetchingMore: boolean;
    hasMore: boolean;
    fetchPage: (pageNum: number) => Promise<void>;
}

const ReadingLogsContext = createContext<ReadingLogsContextValue | undefined>(
    undefined,
);

export function ReadingLogsProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [summaries, setSummaries] = useState<DailySummary[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isFetchingMore, setIsFetchingMore] = useState<boolean>(true);
    const [hasMore, setHasMore] = useState<boolean>(true);

    const { locationDetails } = useCoreHook();
    const { toastError } = useToast();

    const fetchPage = async (pageNum: number) => {
        if (locationDetails.location_id === 0) return;

        try {
            if (pageNum === 1) {
                setIsLoading(true);
            } else {
                setIsFetchingMore(true);
            }

            const res = await readingLogsAPI.getLogsPaginated(
                pageNum,
                10,
                locationDetails.location_id,
            );

            setSummaries((prev) => [...prev, ...res.items]);
            setHasMore(res.has_more);
        } catch (error) {
            console.error("Error fetching daily summaries:", error);
            toastError("Failed to fetch daily summaries");
            setHasMore(false);
        } finally {
            setIsLoading(false);
            setIsFetchingMore(false);
        }
    };

    const contextValue = useMemo(
        () => ({
            summaries,
            isLoading,
            isFetchingMore,
            hasMore,
            fetchPage,
        }),
        [summaries, isLoading, isFetchingMore, hasMore],
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
