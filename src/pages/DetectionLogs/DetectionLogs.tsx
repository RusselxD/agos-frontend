import { useEffect, useRef, useState } from "react";
import { modelReadingLogAPI } from "../../lib/api/modelReadingLog";
import type { BlockageStatus, ModelReadingListItem } from "../../types/modelReadingLog";
import ReadingListItem from "./components/ReadingListItem";
import ReadingDetailModal from "./components/ReadingDetailModal";
import { useCoreHook } from "../../context/CoreContext";

const STATUS_FILTERS: { label: string; value: BlockageStatus | "all" }[] = [
    { label: "All", value: "all" },
    { label: "Clear", value: "clear" },
    { label: "Partial", value: "partial" },
    { label: "Blocked", value: "blocked" },
];

export default function DetectionLogs() {
    const { cameraDeviceDetails } = useCoreHook();
    const [readings, setReadings] = useState<ModelReadingListItem[]>([]);
    const [isFetching, setIsFetching] = useState(true);
    const [selectedReading, setSelectedReading] = useState<ModelReadingListItem | null>(null);
    const [hasMore, setHasMore] = useState(false);
    const [page, setPage] = useState(1);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [statusFilter, setStatusFilter] = useState<BlockageStatus | "all">("all");
    const sentinelRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        document.title = "Detection Logs - AGOS";
        return () => {
            document.title = "AGOS";
        };
    }, []);

    useEffect(() => {
        if (!cameraDeviceDetails) return;

        const fetchReadings = async () => {
            setIsFetching(true);
            setPage(1);
            try {
                const res = await modelReadingLogAPI.getPaginated(
                    1,
                    10,
                    cameraDeviceDetails.camera_device_id,
                    statusFilter === "all" ? undefined : statusFilter,
                );
                setReadings(res.items);
                setHasMore(res.has_more);
            } catch (error) {
                console.error(error);
            } finally {
                setIsFetching(false);
            }
        };

        fetchReadings();
    }, [cameraDeviceDetails, statusFilter]);

    const loadMore = async () => {
        if (!cameraDeviceDetails || isLoadingMore) return;

        const nextPage = page + 1;
        setIsLoadingMore(true);
        try {
            const res = await modelReadingLogAPI.getPaginated(
                nextPage,
                10,
                cameraDeviceDetails.camera_device_id,
                statusFilter === "all" ? undefined : statusFilter,
            );
            setReadings((prev) => [...prev, ...res.items]);
            setHasMore(res.has_more);
            setPage(nextPage);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoadingMore(false);
        }
    };

    useEffect(() => {
        const sentinel = sentinelRef.current;
        if (!sentinel) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
                    loadMore();
                }
            },
            { threshold: 0.1 },
        );

        observer.observe(sentinel);
        return () => observer.disconnect();
    }, [hasMore, isLoadingMore]);

    return (
        <div className="flex flex-1 h-full overflow-hidden">
            <div className="bg-white custom-shadow rounded-xl p-5 flex-1 h-full overflow-auto min-w-0 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="pl-2 border-l-4 font-semibold text-gray-600 border-primary">
                        DETECTION LOGS
                    </h2>
                </div>

                {/* Status filter chips */}
                <div className="flex gap-1.5 mb-4">
                    {STATUS_FILTERS.map((f) => (
                        <button
                            key={f.value}
                            onClick={() => setStatusFilter(f.value)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                                statusFilter === f.value
                                    ? "bg-primary text-white"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>

                {/* List */}
                {isFetching ? (
                    <div className="space-y-3">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="skeleton w-full h-20 rounded-lg" />
                        ))}
                    </div>
                ) : readings.length === 0 ? (
                    <div className="text-sm text-gray-500 text-center py-8">
                        No detection readings found.
                    </div>
                ) : (
                    <div className="space-y-2 overflow-auto flex-1">
                        {readings.map((reading) => (
                            <ReadingListItem
                                key={reading.id}
                                reading={reading}
                                isSelected={selectedReading?.id === reading.id}
                                onClick={() => setSelectedReading(reading)}
                            />
                        ))}

                        <div ref={sentinelRef} className="py-2 flex justify-center">
                            {isLoadingMore && (
                                <div className="spinner w-5 h-5 border-primary border-t-transparent" />
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Detail modal */}
            {selectedReading && (
                <ReadingDetailModal
                    reading={selectedReading}
                    onClose={() => setSelectedReading(null)}
                />
            )}
        </div>
    );
}
