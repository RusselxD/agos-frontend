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
    { label: "Surface Obstruction", value: "blockage" },
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
            className={`absolute md:relative right-0 z-20 h-full rounded-lg border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-white/[0.03] backdrop-blur-xl transition-all duration-300 ease-in-out overflow-hidden custom-shadow md:shadow-none ${
                isOpen ? "w-full md:w-[24rem]" : "w-0"
            }`}
        >
            <div className="flex h-full flex-col w-full md:w-[24rem]">
                {/* Header */}
                <div className="flex items-start justify-between p-4 border-b border-gray-200 dark:border-slate-700/50">
                    <div>
                        <h2 className="font-semibold text-gray-800 dark:text-slate-200 text-sm">
                            DELIVERY HISTORY
                        </h2>
                        <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                            {fullName} &middot; {responder?.phone_number}
                        </p>
                    </div>
                    <button
                        className="rounded-md border border-gray-300 dark:border-slate-600 p-1.5 text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                        onClick={onClose}
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Type filter chips */}
                <div className="flex gap-1.5 px-4 py-3 border-b border-gray-100 dark:border-slate-700/50 overflow-x-auto custom-scrollbar">
                    {TYPE_FILTERS.map((f) => (
                        <button
                            key={f.value}
                            onClick={() => setTypeFilter(f.value)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                                typeFilter === f.value
                                    ? "bg-primary dark:bg-blue-600 text-white shadow-sm"
                                    : "bg-gray-100 dark:bg-slate-700/50 text-gray-600 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-700"
                            }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>

                {/* Delivery list */}
                <div className="flex-1 overflow-auto custom-scrollbar p-4 space-y-2">
                    {isFetching ? (
                        <div className="space-y-3">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="skeleton w-full h-28 rounded-lg" />
                            ))}
                        </div>
                    ) : deliveries.length === 0 ? (
                        <div className="text-sm text-gray-500 dark:text-slate-400 text-center py-8">
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
                                    className="w-full py-2 text-sm text-primary dark:text-blue-400 font-medium hover:bg-primary/5 dark:hover:bg-blue-500/10 rounded-lg transition-colors disabled:opacity-50"
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
