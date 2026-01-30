import {
    createContext,
    useContext,
    useMemo,
    useState,
    type ReactNode,
} from "react";

import type { Status } from "../types/blockage";
import { useWebSocketMessage } from "./WebSocketContext";
import { capitalizeFirstLetter } from "../lib/utils/formatter";
import type { BlockageSummaryResponse } from "../types/blockage";

interface WaterwayContextProps {
    status: Status | null;
    isFetching: boolean;
    warning: string | null;
    error: string | null;
}

const WaterwayContext = createContext<WaterwayContextProps | undefined>(
    undefined,
);

export function BlockageProvider({ children }: { children: ReactNode }) {
    const [status, setStatus] = useState<Status | null>(null);
    const [isFetching, setIsFetching] = useState(true);
    const [warning, setWarning] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useWebSocketMessage(
        "blockage_detection_update",
        (data: BlockageSummaryResponse) => {
            setIsFetching(false);

            if (data.status === "error") {
                setError(data.message);
                setWarning(null);
                setStatus(null);
                return;
            }

            if (data.status === "warning") {
                setWarning(data.message);
                setError(null);
                setStatus(
                    capitalizeFirstLetter(data.blockage_status) as Status,
                );
                return;
            }

            setError(null);
            setWarning(null);
            setStatus(capitalizeFirstLetter(data.blockage_status) as Status);
        },
    );

    const contextValue = useMemo(
        () => ({
            status,
            isFetching,
            warning,
            error,
        }),
        [status, isFetching, warning, error],
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
        throw new Error(
            "useWaterwayContext must be used within a BlockageProvider",
        );
    }
    return context;
};
