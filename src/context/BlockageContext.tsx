import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
    type ReactNode,
} from "react";
import type { Status } from "../lib/types/blockage";

interface WaterwayContextProps {
    setLatestFrameBase64: React.Dispatch<React.SetStateAction<string | null>>;
    status: Status | null;
    isFetching: boolean;
    error: string | null;
}

const WaterwayContext = createContext<WaterwayContextProps | undefined>(
    undefined
);

export function BlockageProvider({ children }: { children: ReactNode }) {
    const [latestFrameBase64, setLatestFrameBase64] = useState<string | null>(
        null
    );
    const [status, setStatus] = useState<Status | null>(null);
    const [isFetching, setIsFetching] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const isFirstFetch = useRef(true);

    useEffect(() => {
        const fetchAnalysis = async () => {
            if (!latestFrameBase64) return;
            console.log("Hey");
            console.log(" latestFrameBase64:", latestFrameBase64);
            try {
                if (isFirstFetch.current) {
                    setIsFetching(true);
                    isFirstFetch.current = false;
                }

                await new Promise((resolve) => setTimeout(resolve, 1000));

                const randomStatus: string = ["Clear", "Partial", "Blocked"][
                    Math.floor(Math.random() * 3)
                ];

                setStatus(randomStatus as Status);

                // const res = await sampleBlockageAPI.getBlockageStatus(
                //     latestFrameBase64
                // );
                // setStatus(res);
            } catch (error) {
                console.log(error);
                setError("Failed to fetch blockage analysis");
            } finally {
                setIsFetching(false);
            }
        };

        fetchAnalysis();
    }, [latestFrameBase64]);

    const contextValue = useMemo(
        () => ({
            setLatestFrameBase64,
            status,
            isFetching,
            error,
        }),
        [setLatestFrameBase64, status, isFetching, error]
    );

    return (
        <WaterwayContext.Provider value={contextValue}>
            {children}
        </WaterwayContext.Provider>
    );
}

export const useWaterwayContext = () => {
    const context = useContext(WaterwayContext);
    if (context === undefined) {
        throw new Error("useWaterwayContext must be used within a BlockageProvider");
    }
    return context;
};
