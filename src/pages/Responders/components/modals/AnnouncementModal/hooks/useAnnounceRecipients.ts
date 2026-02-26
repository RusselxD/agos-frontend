import { useEffect, useMemo, useState } from "react";
import { responderAPI } from "../../../../../../lib/api/responder";
import type { ResponderListItem } from "../../../../../../types/responder";
import { useResponders } from "../../../../context/RespondersPageContext";
import { useToast } from "../../../../../../context/ToastContext";
import { responderGroupAPI } from "../../../../../../lib/api/responderGroup";

export default function useAnnounceRecipients() {
    const { cache, setCache } = useResponders();
    const { toastError } = useToast();
    const [isFetching, setIsFetching] = useState(false);
    const [selectedGroupId, setSelectedGroupId] = useState("");

    const groups = cache.groups ?? [];

    useEffect(() => {
        if (cache.responders !== undefined && cache.groups !== undefined) {
            return;
        }

        let isMounted = true;
        setIsFetching(true);

        (async () => {
            try {
                const [respondersRes, groupsRes] = await Promise.all([
                    cache.responders === undefined
                        ? responderAPI.getAllResponders()
                        : Promise.resolve(undefined),
                    cache.groups === undefined
                        ? responderGroupAPI.getAllGroups()
                        : Promise.resolve(undefined),
                ]);

                if (!isMounted) return;

                setCache((prev) => ({
                    ...prev,
                    responders: respondersRes ?? prev.responders,
                    groups: groupsRes ?? prev.groups,
                }));
            } catch {
                if (isMounted) toastError("Failed to load recipients.");
            } finally {
                if (isMounted) setIsFetching(false);
            }
        })();

        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        if (groups.length > 0 && !selectedGroupId) {
            setSelectedGroupId(String(groups[0].id));
        }
    }, [groups, selectedGroupId]);

    const selectedGroup = useMemo(
        () =>
            groups.find((g) => String(g.id) === selectedGroupId) ?? groups[0],
        [groups, selectedGroupId],
    );

    const responderIds = selectedGroup?.member_ids ?? [];

    const respondersById = useMemo(
        () => new Map((cache.responders ?? []).map((r) => [r.id, r] as const)),
        [cache.responders],
    );

    const selectedResponders = useMemo<ResponderListItem[]>(
        () =>
            responderIds
                .map((id) => respondersById.get(id))
                .filter((r): r is ResponderListItem => r !== undefined),
        [responderIds, respondersById],
    );

    return {
        groups,
        selectedGroupId,
        setSelectedGroupId,
        selectedGroup,
        responderIds,
        selectedResponders,
        isFetching,
    };
}
