import { useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { notificationTemplatesAPI } from "../../../../../../lib/api/notificationTemplate";
import type { NotificationTemplate } from "../../../../../../types/responder";
import type { TabsCache } from "../../../../context/RespondersPageContext";

interface UseAnnounceTemplatesParams {
    templates: NotificationTemplate[] | undefined;
    setCache: Dispatch<SetStateAction<TabsCache>>;
    toastError: (message: string) => void;
}

export default function useAnnounceTemplates({
    templates,
    setCache,
    toastError,
}: UseAnnounceTemplatesParams) {
    const [isFetchingTemplates, setIsFetchingTemplates] = useState(false);

    useEffect(() => {
        const fetchTemplates = async () => {
            if (templates !== undefined) {
                return;
            }

            setIsFetchingTemplates(true);
            try {
                const res = await notificationTemplatesAPI.getAllNotification();
                setCache((prevCache) => ({
                    ...prevCache,
                    templates: res,
                }));
            } catch {
                toastError("Failed to load message templates.");
            } finally {
                setIsFetchingTemplates(false);
            }
        };

        fetchTemplates();
    }, [setCache, templates, toastError]);

    return {
        templates: templates ?? [],
        isFetchingTemplates,
    };
}
