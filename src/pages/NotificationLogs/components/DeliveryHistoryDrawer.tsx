import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { ResponderNotificationSummary } from "../../../types/notificationLog";
import type { DeliveryLogItem } from "../../../types/notificationLog";
import type { NotificationType } from "../../../types/responder";
import { notificationLogAPI } from "../../../lib/api/notificationLog";
import DeliveryItemCard from "./DeliveryItem";

const TYPE_FILTERS: { label: string; value: NotificationType | "all" }[] = [
    { label: "All", value: "all" },
    { label: "Critical", value: "critical" },
    { label: "Warning", value: "warning" },
    { label: "Blockage", value: "blockage" },
    { label: "Announcement", value: "announcement" },
];

interface Props {
    responder: ResponderNotificationSummary | null;
    onClose: () => void;
}

export default function DeliveryHistoryDrawer({ responder, onClose }: Props) {
    const [deliveries, setDeliveries] = useState<DeliveryLogItem[]>([]);
    const [isFetching, setIsFetching] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [page, setPage] = useState(1);
    const [typeFilter, setTypeFilter] = useState<NotificationType | "all">("all");
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const isOpen = responder !== null;

    // Reset and fetch when responder or filter changes
    useEffect(() => {
        if (!responder) return;

        const fetchDeliveries = async () => {
            setIsFetching(true);
            setPage(1);
            try {
                const res = await notificationLogAPI.getResponderDeliveries(
                    responder.id,
                    1,
                    10,
                    typeFilter === "all" ? undefined : typeFilter,
                );
                setDeliveries(res.items);
                setHasMore(res.has_more);
            } catch (error) {
                console.error(error);
            } finally {
                setIsFetching(false);
            }
        };

        fetchDeliveries();
    }, [responder?.id, typeFilter]);

    const loadMore = async () => {
        if (!responder || isLoadingMore) return;

        const nextPage = page + 1;
        setIsLoadingMore(true);
        try {
            const res = await notificationLogAPI.getResponderDeliveries(
                responder.id,
                nextPage,
                10,
                typeFilter === "all" ? undefined : typeFilter,
            );
            setDeliveries((prev) => [...prev, ...res.items]);
            setHasMore(res.has_more);
            setPage(nextPage);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoadingMore(false);
        }
    };

    const fullName = responder
        ? `${responder.first_name} ${responder.last_name}`
        : "";

    return (
        <div
            className={`absolute md:relative right-0 z-20 h-full rounded-lg border border-gray-200 bg-white transition-all duration-300 ease-in-out overflow-hidden custom-shadow md:shadow-none ${
                isOpen ? "w-full md:w-[24rem]" : "w-0"
            }`}
        >
            <div className="flex h-full flex-col w-[100vw] md:w-[24rem]">
                {/* Header */}
                <div className="flex items-start justify-between p-4 border-b border-gray-200">
                    <div>
                        <h2 className="font-semibold text-gray-800 text-sm">
                            DELIVERY HISTORY
                        </h2>
                        <p className="text-xs text-gray-500 mt-0.5">
                            {fullName} &middot; {responder?.phone_number}
                        </p>
                    </div>
                    <button
                        className="rounded-md border border-gray-300 p-1.5 text-gray-600 hover:bg-gray-100"
                        onClick={onClose}
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Type filter chips */}
                <div className="flex gap-1.5 px-4 py-3 border-b border-gray-100 overflow-x-auto">
                    {TYPE_FILTERS.map((f) => (
                        <button
                            key={f.value}
                            onClick={() => setTypeFilter(f.value)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                                typeFilter === f.value
                                    ? "bg-primary text-white"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>

                {/* Delivery list */}
                <div className="flex-1 overflow-auto p-4 space-y-2">
                    {isFetching ? (
                        <div className="space-y-3">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="skeleton w-full h-28 rounded-lg" />
                            ))}
                        </div>
                    ) : deliveries.length === 0 ? (
                        <div className="text-sm text-gray-500 text-center py-8">
                            No notifications found.
                        </div>
                    ) : (
                        <>
                            {deliveries.map((delivery) => (
                                <DeliveryItemCard key={delivery.id} delivery={delivery} />
                            ))}

                            {hasMore && (
                                <button
                                    onClick={loadMore}
                                    disabled={isLoadingMore}
                                    className="w-full py-2 text-sm text-primary font-medium hover:bg-primary/5 rounded-lg transition-colors disabled:opacity-50"
                                >
                                    {isLoadingMore ? "Loading..." : "Load more"}
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
