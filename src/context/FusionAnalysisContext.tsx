import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
    type ReactNode,
} from "react";

import type {
    AlertThresholds,
    FusionAnalysisData,
} from "../types/fusionAnalysis";

import { sampleFusionAnalysisAPI } from "../lib/api/fusionAnalysis";

interface FusionAnalysisContextValue {
    analysisData: FusionAnalysisData | null;
    alertThresholds: AlertThresholds | null;
    isFetching: boolean;
    error: string | null;
}

const FusionAnalysisContext = createContext<
    FusionAnalysisContextValue | undefined
>(undefined);

export function FusionAnalysisProvider({ children }: { children: ReactNode }) {
    const [analysisData, setAnalysisData] = useState<FusionAnalysisData | null>(
        null
    );
    const [alertThresholds, setAlertThresholds] =
        useState<AlertThresholds | null>(null);
    const [isFetching, setIsFetching] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const isFirstFetch = useRef(true);

    useEffect(() => {
        const fetchAlertThresholds = async () => {
            try {
                const res =
                    await sampleFusionAnalysisAPI.getAnalysisThresholds();
                setAlertThresholds(res);
            } catch (error) {
                setError("Failed to fetch alert thresholds");
            } finally {
            }
        };

        const fetchFusionAnalysisData = async () => {
            try {
                if (isFirstFetch.current) {
                    setIsFetching(true);
                    isFirstFetch.current = false;
                }

                const res = await sampleFusionAnalysisAPI.getLatestFusionData();
                setAnalysisData(res);
            } catch (error) {
                setError("Failed to fetch fusion analysis data");
            } finally {
                setIsFetching(false);
            }
        };

        fetchFusionAnalysisData();
        fetchAlertThresholds();

        const intervalId = setInterval(fetchFusionAnalysisData, 5 * 1000); // Fetch every 1 minute

        return () => clearInterval(intervalId);
    }, []);

    const contextValue = useMemo(
        () => ({ analysisData, alertThresholds, isFetching, error }),
        [analysisData, alertThresholds, isFetching, error]
    );

    return (
        <FusionAnalysisContext.Provider value={contextValue}>
            {children}
        </FusionAnalysisContext.Provider>
    );
}

export const useFusionAnalysis = () => {
    const context = useContext(FusionAnalysisContext);
    if (context === undefined) {
        throw new Error(
            "useFusionAnalysis must be used within a FusionAnalysisProvider"
        );
    }
    return context;
};
