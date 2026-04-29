import { useEffect, useState } from "react";
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

    return (
        <div className="flex min-w-0 flex-1">
            <div className="custom-shadow flex min-h-[28rem] min-w-0 flex-1 flex-col overflow-auto rounded-xl bg-white p-3 sm:p-5">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="pl-2 border-l-4 font-semibold text-gray-600 border-primary">
                        DETECTION LOGS
                    </h2>
                </div>

                {/* Status filter chips */}
                <div className="mb-4 flex gap-1.5 overflow-x-auto pb-1">
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
                    <div className="flex-1 space-y-2 overflow-auto">
                        {readings.map((reading) => (
                            <ReadingListItem
                                key={reading.id}
                                reading={reading}
                                isSelected={selectedReading?.id === reading.id}
                                onClick={() => setSelectedReading(reading)}
                            />
                        ))}

                        {hasMore && (
                            <button
                                type="button"
                                onClick={loadMore}
                                disabled={isLoadingMore}
                                className="w-full rounded-lg border border-primary/30 px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isLoadingMore ? "Loading..." : "Load more detections"}
                            </button>
                        )}
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
