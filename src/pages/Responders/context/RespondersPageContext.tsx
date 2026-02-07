import {
    createContext,
    useContext,
    useMemo,
    useState,
    type Dispatch,
    type SetStateAction,
} from "react";
import type { MessageTemplate, ResponderListItem } from "../../../types/responder";

interface TabsCache {
    templates: MessageTemplate[];
    send_sms: any;
    groups: any;
    responders: ResponderListItem[];
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
        templates: [],
        send_sms: null,
        groups: null,
        responders: [],
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
