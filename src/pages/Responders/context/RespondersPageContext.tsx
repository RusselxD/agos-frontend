import {
    createContext,
    useContext,
    useMemo,
    useState,
    type Dispatch,
    type SetStateAction,
} from "react";
import type {
    MessageTemplate,
    ResponderListItem,
} from "../../../types/responder";

interface TabsCache {
    templates: MessageTemplate[] | undefined;
    send_sms: any;
    groups: any;
    responders: ResponderListItem[] | undefined;
}
interface RespondersPageContextValue {
    cache: TabsCache;
    setCache: Dispatch<SetStateAction<TabsCache>>;
}

const RespondersPageContext = createContext<
    RespondersPageContextValue | undefined
>(undefined);

export function RespondersPageProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [cache, setCache] = useState<TabsCache>({
        templates: undefined,
        send_sms: undefined,
        groups: undefined,
        responders: undefined,
    });

    const contextValue = useMemo(
        () => ({
            cache,
            setCache,
        }),
        [cache],
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
