import { useEffect, useMemo, useState } from "react";
import { CircleAlert } from "lucide-react";
import Container from "../../../../components/ui/Container";
import { responderAPI, responderGroupAPI } from "../../../../lib/api/responder";
import { useResponders } from "../../context/RespondersPageContext";
import RecipientsTable from "./components/RecipientsTable";
import SelectedRespondersBar from "./components/SelectedRespondersBar";

export interface SendSMSResponderRow {
    id: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    groups: string[];
}

export default function SendSMS() {
    const { cache, setCache } = useResponders();
    const [isFetching, setIsFetching] = useState(false);
    const [selectedResponderIds, setSelectedResponderIds] = useState<
        Set<string>
    >(new Set());

    const activeResponders = useMemo<SendSMSResponderRow[]>(() => {
        const groupsByResponderId = new Map<string, string[]>();

        for (const group of cache.groups ?? []) {
            for (const memberId of group.member_ids) {
                const existingGroups = groupsByResponderId.get(memberId) ?? [];
                existingGroups.push(group.group_name);
                groupsByResponderId.set(memberId, existingGroups);
            }
        }

        return (cache.responders ?? [])
            .filter((responder) => responder.status.toLowerCase() === "active")
            .map((responder) => {
                const responderGroups = [
                    ...new Set(groupsByResponderId.get(responder.id) ?? []),
                ].sort((a, b) => a.localeCompare(b));

                return {
                    id: responder.id,
                    first_name: responder.first_name,
                    last_name: responder.last_name,
                    phone_number: responder.phone_number,
                    groups: responderGroups,
                };
            });
    }, [cache.groups, cache.responders]);

    useEffect(() => {
        const fetchSendSMSData = async () => {
            if (cache.responders !== undefined && cache.groups !== undefined) {
                return;
            }

            setIsFetching(true);
            try {
                const [respondersRes, groupsRes] = await Promise.all([
                    cache.responders === undefined
                        ? responderAPI.getAllResponders()
                        : Promise.resolve(undefined),
                    cache.groups === undefined
                        ? responderGroupAPI.getAllGroups()
                        : Promise.resolve(undefined),
                ]);

                setCache((prevCache) => ({
                    ...prevCache,
                    responders: respondersRes ?? prevCache.responders,
                    groups: groupsRes ?? prevCache.groups,
                }));
            } finally {
                setIsFetching(false);
            }
        };

        fetchSendSMSData();
    }, [cache.groups, cache.responders, setCache]);

    useEffect(() => {
        setSelectedResponderIds((prev) => {
            const validIds = new Set(
                activeResponders.map((responder) => responder.id),
            );
            const next = new Set(
                [...prev].filter((responderId) => validIds.has(responderId)),
            );

            if (next.size === prev.size) {
                return prev;
            }

            return next;
        });
    }, [activeResponders]);

    const selectedCount = selectedResponderIds.size;
    const allSelected =
        activeResponders.length > 0 &&
        selectedResponderIds.size === activeResponders.length;

    const handleToggleResponder = (responderId: string) => {
        setSelectedResponderIds((prev) => {
            const next = new Set(prev);

            if (next.has(responderId)) {
                next.delete(responderId);
            } else {
                next.add(responderId);
            }

            return next;
        });
    };

    const handleSelectAll = () => {
        setSelectedResponderIds(
            new Set(activeResponders.map((responder) => responder.id)),
        );
    };

    const handleDeselectAll = () => {
        setSelectedResponderIds(new Set());
    };

    const handleToggleSelectAllFromHeader = () => {
        if (allSelected) {
            handleDeselectAll();
            return;
        }

        handleSelectAll();
    };

    return (
        <>
            <Container className="flex-1 h-full overflow-auto pb-20">
                <div className="mb-3 flex items-center justify-between">
                    <h2 className="w-full border-l-4 border-primary pl-2 font-semibold text-gray-600">
                        SELECT RECIPIENTS
                    </h2>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={handleSelectAll}
                            disabled={activeResponders.length === 0}
                            className="btn-custom whitespace-nowrap rounded-md border border-blue-200 bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Select All
                        </button>
                        <button
                            type="button"
                            onClick={handleDeselectAll}
                            disabled={selectedCount === 0}
                            className="btn-custom whitespace-nowrap rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Deselect All
                        </button>
                    </div>
                </div>

                <div className="mb-4 flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-4 text-blue-700">
                    <CircleAlert className="mt-0.5 h-5 w-5 shrink-0" />
                    <p className="text-sm leading-7">
                        Select individual responders below to send SMS messages.
                        You can select multiple recipients and choose a template
                        or write a custom message.
                    </p>
                </div>

                {isFetching && (
                    <div className="space-y-2">
                        <div className="skeleton h-12 w-full rounded-md"></div>
                        <div className="skeleton h-12 w-full rounded-md"></div>
                        <div className="skeleton h-12 w-full rounded-md"></div>
                        <div className="skeleton h-12 w-full rounded-md"></div>
                    </div>
                )}

                {!isFetching && (
                    <RecipientsTable
                        responders={activeResponders}
                        selectedResponderIds={selectedResponderIds}
                        allSelected={allSelected}
                        onToggleResponder={handleToggleResponder}
                        onToggleSelectAll={handleToggleSelectAllFromHeader}
                    />
                )}
            </Container>

            {selectedCount > 0 && (
                <SelectedRespondersBar
                    selectedCount={selectedCount}
                    selectedResponderIds={[...selectedResponderIds]}
                    onSendSuccess={handleDeselectAll}
                />
            )}
        </>
    );
}
