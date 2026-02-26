import { useEffect, useMemo, useState } from "react";
import Container from "../../../../components/ui/Container";
import { responderAPI } from "../../../../lib/api/responder";
import { useResponders } from "../../context/RespondersPageContext";
import RecipientsTable from "./components/RecipientsTable";
import RecipientSelectionHeader from "./components/RecipientSelectionHeader";
import SelectionInfoBanner from "./components/SelectionInfoBanner";
import RecipientsLoadingSkeleton from "./components/RecipientsLoadingSkeleton";
import SelectedRespondersBar from "./components/SelectedRespondersBar";
import { responderGroupAPI } from "../../../../lib/api/responderGroup";

export interface AnnounceResponderRow {
    id: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    groups: string[];
}

export default function Announce() {
    const { cache, setCache, getActiveResponders } = useResponders();
    const [isFetching, setIsFetching] = useState(false);
    const [selectedResponderIds, setSelectedResponderIds] = useState<string[]>(
        [],
    );

    const activeResponders = getActiveResponders() ?? [];

    useEffect(() => {
        if (cache.responders !== undefined && cache.groups !== undefined) {
            return;
        }

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

                setCache((prev) => ({
                    ...prev,
                    responders: respondersRes ?? prev.responders,
                    groups: groupsRes ?? prev.groups,
                }));
            } finally {
                setIsFetching(false);
            }
        })();
    }, [cache.groups, cache.responders, setCache]);

    // Ensure selected responders are still valid when responders or groups data changes
    useEffect(() => {
        const validIds = new Set(activeResponders.map((r) => r.id));
        setSelectedResponderIds((prev) => {
            const next = prev.filter((id) => validIds.has(id));
            if (next.length === prev.length) return prev;
            return next;
        });
    }, [activeResponders]);

    const allSelected =
        activeResponders.length > 0 &&
        selectedResponderIds.length === activeResponders.length;

    const responderRows = useMemo<AnnounceResponderRow[]>(
        () =>
            activeResponders.map((r) => ({
                ...r,
                groups: (cache.groups ?? []).filter((g) =>
                    g.member_ids.includes(r.id),
                ).map((g) => g.group_name),
            })),
        [activeResponders, cache.groups],
    );

    const handleToggleResponder = (responderId: string) => {
        setSelectedResponderIds((prev) =>
            prev.includes(responderId)
                ? prev.filter((id) => id !== responderId)
                : [...prev, responderId],
        );
    };

    const handleSelectAll = () => {
        setSelectedResponderIds(activeResponders.map((r) => r.id));
    };

    const handleDeselectAll = () => setSelectedResponderIds([]);

    return (
        <>
            <Container className="flex-1 h-full overflow-auto pb-20">
                <RecipientSelectionHeader
                    onSelectAll={handleSelectAll}
                    onDeselectAll={handleDeselectAll}
                    selectAllDisabled={activeResponders.length === 0}
                    deselectAllDisabled={selectedResponderIds.length === 0}
                />

                <SelectionInfoBanner />

                {isFetching ? (
                    <RecipientsLoadingSkeleton />
                ) : (
                    <RecipientsTable
                        responders={responderRows}
                        selectedResponderIds={selectedResponderIds}
                        allSelected={allSelected}
                        onToggleResponder={handleToggleResponder}
                        onToggleSelectAll={() =>
                            allSelected ? handleDeselectAll() : handleSelectAll()
                        }
                    />
                )}
            </Container>

            {selectedResponderIds.length > 0 && (
                <SelectedRespondersBar
                    selectedCount={selectedResponderIds.length}
                    selectedResponderIds={selectedResponderIds}
                    onSendSuccess={handleDeselectAll}
                />
            )}
        </>
    );
}
