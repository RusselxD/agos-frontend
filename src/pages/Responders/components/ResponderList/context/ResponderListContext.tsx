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

interface ResponderListContextValue {
    chosenResponder: ResponderListItem | undefined;
    cachedResponders: Record<string, ResponderAllDetails>;
    sideDrawerOpen: boolean;
    addResponderFormOpen: boolean;

    setSideDrawerOpen: Dispatch<SetStateAction<boolean>>;
    setAddResponderFormOpen: Dispatch<SetStateAction<boolean>>;
    handleChooseResponder: (responder: ResponderListItem) => void;
    responderExistsInCache: (responderId: string) => boolean;
    addResponderToCache: (responder: ResponderAllDetails) => void;
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
    const [addResponderFormOpen, setAddResponderFormOpen] =
        useState<boolean>(false);

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

    const contextValue = useMemo(
        () => ({
            chosenResponder,
            cachedResponders,
            sideDrawerOpen,
            addResponderFormOpen,
            setSideDrawerOpen,
            setAddResponderFormOpen,
            handleChooseResponder,
            responderExistsInCache,
            addResponderToCache,
        }),
        [
            chosenResponder,
            cachedResponders,
            sideDrawerOpen,
            addResponderFormOpen,
        ],
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
