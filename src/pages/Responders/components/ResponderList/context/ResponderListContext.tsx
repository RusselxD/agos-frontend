import {
    createContext,
    useContext,
    useMemo,
    useState,
    type Dispatch,
    type SetStateAction,
} from "react";
import type {
    ResponderAllDetails,
    ResponderListItem,
} from "../../../../../types/responder";
import { useResponders } from "../../../context/RespondersPageContext";

interface ResponderListContextValue {
    chosenResponder: ResponderListItem | undefined;
    cachedResponders: Record<string, ResponderAllDetails>;
    sideDrawerOpen: boolean;

    setSideDrawerOpen: Dispatch<SetStateAction<boolean>>;
    handleChooseResponder: (responder: ResponderListItem) => void;
    responderExistsInCache: (responderId: string) => boolean;
    addResponderToCache: (responder: ResponderAllDetails) => void;
    modifyResponderInList: (responderId: string) => void;
}

export const ResponderListContext = createContext<
    ResponderListContextValue | undefined
>(undefined);

export function ResponderListProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [chosenResponder, setChosenResponder] = useState<
        ResponderListItem | undefined
    >(undefined);
    const [sideDrawerOpen, setSideDrawerOpen] = useState<boolean>(false);

    const [cachedResponders, setCachedResponders] = useState<
        Record<string, ResponderAllDetails>
    >({});

    const handleChooseResponder = (responder: ResponderListItem) => {
        setChosenResponder(responder);
        setSideDrawerOpen(true);
    };

    const responderExistsInCache = (responderId: string) => {
        return cachedResponders.hasOwnProperty(responderId);
    };

    const addResponderToCache = (responder: ResponderAllDetails) => {
        setCachedResponders((prevCache) => ({
            ...prevCache,
            [responder.id]: responder,
        }));
    };

    const { setCache } = useResponders();

    const modifyResponderInList = (responderId: string) => {
        setCache((prevCache) => ({
            ...prevCache,
            responders: prevCache.responders.map((responder) =>
                responder.id === responderId
                    ? { ...responder, status: "approved" }
                    : responder,
            ),
        }));

        // Update chosenResponder if it's the one being modified
        if (chosenResponder?.id === responderId) {
            setChosenResponder({ ...chosenResponder, status: "approved" });
        }

        setCachedResponders((prevCache) => {
            const newCache = { ...prevCache };
            delete newCache[responderId];
            return newCache;
        });
    };

    const contextValue = useMemo(
        () => ({
            chosenResponder,
            cachedResponders,
            sideDrawerOpen,
            setSideDrawerOpen,
            handleChooseResponder,
            responderExistsInCache,
            addResponderToCache,
            modifyResponderInList,
        }),
        [chosenResponder, cachedResponders, sideDrawerOpen],
    );

    return (
        <ResponderListContext.Provider value={contextValue}>
            {children}
        </ResponderListContext.Provider>
    );
}
export const useResponderList = () => {
    const context = useContext(ResponderListContext);
    if (context === undefined) {
        throw new Error(
            "useResponderList must be used within a ResponderListProvider",
        );
    }
    return context;
};
