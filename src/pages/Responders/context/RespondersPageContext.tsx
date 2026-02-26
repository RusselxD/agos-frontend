import {
    createContext,
    useContext,
    useMemo,
    useState,
    type Dispatch,
    type SetStateAction,
} from "react";
import type {
    NotificationTemplate,
    ResponderGroup,
    ResponderListItem,
} from "../../../types/responder";

export interface TabsCache {
    templates: NotificationTemplate[] | undefined;
    send_sms: any;
    groups: ResponderGroup[] | undefined;
    responders: ResponderListItem[] | undefined;
}
interface RespondersPageContextValue {
    cache: TabsCache;
    setCache: Dispatch<SetStateAction<TabsCache>>;
    getActiveResponders: () => ResponderListItem[] | undefined;
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

    const getActiveResponders = () => {
        const activeResponderIdsSet = new Set(
            cache.responders
                ?.filter(
                    (responder) => responder.status.toLowerCase() === "active",
                )
                .map((responder) => responder.id),
        );

        return cache.responders?.filter((responder) =>
            activeResponderIdsSet.has(responder.id),
        );
    };

    const contextValue = useMemo(
        () => ({
            cache,
            setCache,
            getActiveResponders,
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
