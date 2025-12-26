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
    error: string | null;
}

const WaterwayContext = createContext<WaterwayContextProps | undefined>(
    undefined
);

export function BlockageProvider({ children }: { children: ReactNode }) {
    const [status, setStatus] = useState<Status | null>(null);
    const [isFetching, setIsFetching] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useWebSocketMessage(
        "blockage_detection_update",
        (data: BlockageSummaryResponse) => {
            if (data.status == "error") {
                setError(data.message);
            } else if (data.status == "warning") {
                setError(data.message);
                setStatus(capitalizeFirstLetter(data.blockage_status) as Status);
            } else if (data.status == "success") {
                setError(null);
                setStatus(capitalizeFirstLetter(data.blockage_status) as Status);
            }
            setIsFetching(false);
            console.log("BLOCKAGE STATUS UPDATE RECEIVED");
            console.log(data);
        }
    );

    const contextValue = useMemo(
        () => ({
            
            status,
            isFetching,
            error,
        }),
        [ status, isFetching, error]
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
            "useWaterwayContext must be used within a BlockageProvider"
        );
    }
    return context;
};
