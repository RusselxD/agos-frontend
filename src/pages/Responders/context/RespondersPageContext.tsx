import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode, Dispatch, SetStateAction } from "react";
import type {
    ResponderDetailsResponse,
    ResponderListItem,
    ResponderListResponse,
} from "../../../types/responder";
import { responderAPI } from "../../../lib/api/responder";

export const RESPONDER_STATUS = ["All", "Approved", "Pending"];

interface RespondersPageContextValue {
    isFetching: boolean;
    showedResponders: ResponderListItem[];
    cachedResponders: Record<string, ResponderDetailsResponse>;

    pendingRespondersCount: number;

    selectedOption: string;

    selectedResponderId: string | null;

    openSideDrawer: boolean;

    setSelectedOption: Dispatch<SetStateAction<string>>;
    setOpenSideDrawer: Dispatch<SetStateAction<boolean>>;

    modifyResponderInList: (responderId: string) => void;

    responderExistsInCache: (responderId: string) => boolean;
    addToRespondersCache: (responder: ResponderDetailsResponse) => void;
    handleChooseResponder: (responderId: string) => void;
}

const RespondersPageContext = createContext<
    RespondersPageContextValue | undefined
>(undefined);

export function RespondersPageProvider({ children }: { children: ReactNode }) {
    const [isFetching, setIsFetching] = useState(false);
    const [responders, setResponders] = useState<ResponderListItem[]>([]); // Master list
    const [selectedOption, setSelectedOption] = useState(RESPONDER_STATUS[0]);

    const showedResponders = useMemo(() => {
        // Filtered list
        if (selectedOption === "All") {
            return responders;
        } else {
            return responders.filter(
                (responder) =>
                    responder.status.toLowerCase() ===
                    selectedOption.toLowerCase(),
            );
        }
    }, [responders, selectedOption]);

    const [cachedResponders, setCachedResponders] = useState<
        Record<string, ResponderDetailsResponse>
    >({});

    const [pendingRespondersCount, setPendingRespondersCount] = useState(0);

    const [openSideDrawer, setOpenSideDrawer] = useState(false);
    const [selectedResponderId, setSelectedResponderId] = useState<
        string | null
    >(null);

    const handleChooseResponder = (responderId: string) => {
        if (!openSideDrawer) {
            setOpenSideDrawer(true);
        }

        setSelectedResponderId(responderId);
    };

    const responderExistsInCache = (responderId: string): boolean => {
        return cachedResponders.hasOwnProperty(responderId);
    };

    const addToRespondersCache = (
        responder: ResponderDetailsResponse,
    ): void => {
        setCachedResponders((prevCache) => ({
            ...prevCache,
            [responder.id]: responder,
        }));
    };

    const modifyResponderInList = (responderId: string) => {
        setResponders((prevResponders) =>
            prevResponders.map((responder) =>
                responder.id === responderId
                    ? { ...responder, status: "approved" }
                    : responder,
            ),
        );

        setCachedResponders((prevCache) => {
            const newCache = { ...prevCache };
            delete newCache[responderId];
            return newCache;
        });
    };

    useEffect(() => {
        const fetchResponders = async () => {
            try {
                setIsFetching(true);
                await new Promise((resolve) => setTimeout(resolve, 3000)); // Simulate loading delay
                const res: ResponderListResponse =
                    await responderAPI.getAllResponders();
                setResponders(res.responders);
                setPendingRespondersCount(
                    res.responders.filter(
                        (responder) =>
                            responder.status.toLowerCase() === "pending",
                    ).length,
                );
            } catch (error) {
                console.log(error);
            } finally {
                setIsFetching(false);
            }
        };
        fetchResponders();
    }, []);

    const contextValue = useMemo(
        () => ({
            isFetching,
            showedResponders,
            cachedResponders,
            pendingRespondersCount,
            selectedOption,

            openSideDrawer,
            selectedResponderId,

            setSelectedOption,
            setOpenSideDrawer,

            modifyResponderInList,

            handleChooseResponder,
            responderExistsInCache,
            addToRespondersCache,
        }),
        [
            isFetching,
            responders,
            cachedResponders,
            pendingRespondersCount,
            openSideDrawer,
            selectedResponderId,
            selectedOption,
        ],
    );

    return (
        <RespondersPageContext.Provider value={contextValue}>
            {children}
        </RespondersPageContext.Provider>
    );
}

export const useResponders = () => {
    const context = useContext(RespondersPageContext);
    if (context === undefined) {
        throw new Error(
            "useResponders must be used within a RespondersPageProvider",
        );
    }
    return context;
};
