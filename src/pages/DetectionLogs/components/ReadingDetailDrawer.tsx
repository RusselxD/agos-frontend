import { useEffect, useState } from "react";
import { X, ImageOff } from "lucide-react";
import type { ModelReadingListItem, ModelReadingDetailResponse } from "../../../types/modelReadingLog";
import { modelReadingLogAPI } from "../../../lib/api/modelReadingLog";
import { format } from "date-fns";

const STATUS_STYLES: Record<string, string> = {
    clear: "bg-emerald-100 text-emerald-700",
    partial: "bg-amber-100 text-amber-700",
    blocked: "bg-red-100 text-red-700",
};

interface Props {
    reading: ModelReadingListItem | null;
    onClose: () => void;
}

export default function ReadingDetailDrawer({ reading, onClose }: Props) {
    const [detail, setDetail] = useState<ModelReadingDetailResponse | null>(null);
    const [isFetching, setIsFetching] = useState(false);
    const [imageError, setImageError] = useState(false);

    const isOpen = reading !== null;

    useEffect(() => {
        if (!reading) return;

        const fetchDetail = async () => {
            setIsFetching(true);
            setImageError(false);
            try {
                const data = await modelReadingLogAPI.getDetail(reading.id);
                setDetail(data);
            } catch (error) {
                console.error(error);
            } finally {
                setIsFetching(false);
            }
        };

        fetchDetail();
    }, [reading?.id]);

    return (
        <div
            className={`h-full rounded-lg border border-gray-200 bg-white transition-[width] duration-300 ease-in-out overflow-hidden ${
                isOpen ? "w-[24rem]" : "w-0"
            }`}
        >
            <div className="flex h-full flex-col w-[24rem]">
                {/* Header */}
                <div className="flex items-start justify-between p-4 border-b border-gray-200">
                    <div>
                        <h2 className="font-semibold text-gray-800 text-sm">
                            DETECTION DETAIL
                        </h2>
                        <p className="text-xs text-gray-500 mt-0.5">
                            Reading #{reading?.id}
                        </p>
                    </div>
                    <button
                        className="rounded-md border border-gray-300 p-1.5 text-gray-600 hover:bg-gray-100"
                        onClick={onClose}
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto p-4 space-y-4">
                    {isFetching ? (
                        <div className="space-y-3">
                            <div className="skeleton w-full h-48 rounded-lg" />
                            <div className="skeleton w-full h-6 rounded-md" />
                            <div className="skeleton w-3/4 h-6 rounded-md" />
                            <div className="skeleton w-1/2 h-6 rounded-md" />
                        </div>
                    ) : detail ? (
                        <>
                            {/* Captured image */}
                            <div className="rounded-lg overflow-hidden border border-gray-200">
                                {imageError ? (
                                    <div className="w-full h-48 bg-gray-100 flex flex-col items-center justify-center text-gray-400">
                                        <ImageOff className="w-8 h-8 mb-1" />
                                        <span className="text-xs">Image unavailable</span>
                                    </div>
                                ) : (
                                    <img
                                        src={detail.image_path}
                                        alt={`Detection reading #${detail.id}`}
                                        className="w-full h-auto object-cover"
                                        onError={() => setImageError(true)}
                                    />
                                )}
                            </div>

                            {/* Status badge */}
                            <div className="flex items-center gap-2">
                                <span className={`text-[0.7rem] font-semibold uppercase px-2.5 py-1 rounded-full ${STATUS_STYLES[detail.blockage_status] ?? "bg-gray-100 text-gray-600"}`}>
                                    {detail.blockage_status}
                                </span>
                            </div>

                            {/* Detail fields */}
                            <div className="space-y-3">
                                <DetailRow label="Blockage %" value={`${detail.blockage_percentage.toFixed(1)}%`} />
                                <DetailRow label="Debris Count" value={String(detail.total_debris_count)} />
                                <DetailRow label="Detected At" value={format(new Date(detail.timestamp), "MMM d, yyyy 'at' h:mm:ss a")} />
                                <DetailRow label="Recorded At" value={format(new Date(detail.created_at), "MMM d, yyyy 'at' h:mm:ss a")} />
                                <DetailRow label="Camera Device" value={`ID: ${detail.camera_device_id}`} />
                            </div>
                        </>
                    ) : (
                        <div className="text-sm text-gray-500 text-center py-8">
                            Failed to load detail.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function DetailRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">{label}</span>
            <span className="font-medium text-gray-800">{value}</span>
        </div>
    );
}
