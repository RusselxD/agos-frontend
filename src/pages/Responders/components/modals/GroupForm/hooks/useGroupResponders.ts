import { useEffect } from "react";
import type { Dispatch, SetStateAction } from "react";
import { responderAPI } from "../../../../../../lib/api/responder";
import type { ResponderListItem } from "../../../../../../types/responder";
import type { TabsCache } from "../../../../context/RespondersPageContext";

interface UseGroupRespondersParams {
    responders: ResponderListItem[] | undefined;
    setCache: Dispatch<SetStateAction<TabsCache>>;
    setIsFetching: Dispatch<SetStateAction<boolean>>;
}

export default function useGroupResponders({
    responders,
    setCache,
    setIsFetching,
}: UseGroupRespondersParams) {
    useEffect(() => {
        const fetchResponders = async () => {
            if (responders !== undefined) {
                return;
            }

            setIsFetching(true);
            try {
                const res = await responderAPI.getAllResponders();
                setCache((prevCache) => ({
                    ...prevCache,
                    responders: res,
                }));
            } catch {
                // Preserve current behavior: silently fail and stop loading state.
            } finally {
                setIsFetching(false);
            }
        };

        fetchResponders();
    }, [responders, setCache, setIsFetching]);
}
