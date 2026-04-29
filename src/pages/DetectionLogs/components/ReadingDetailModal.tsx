import { useEffect, useState } from "react";
import { X, ImageOff, CircleCheck, TriangleAlert, CircleAlert, Camera, Clock } from "lucide-react";
import { createPortal } from "react-dom";
import type { ModelReadingListItem, ModelReadingDetailResponse } from "../../../types/modelReadingLog";
import { modelReadingLogAPI } from "../../../lib/api/modelReadingLog";
import { format } from "date-fns";

const STATUS_CONFIG = {
    clear: {
        icon: CircleCheck,
        label: "Clear",
        badge: "bg-emerald-50 text-emerald-700 ring-emerald-200",
        accent: "text-emerald-600",
        bg: "bg-emerald-500",
    },
    partial: {
        icon: TriangleAlert,
        label: "Partial Blockage",
        badge: "bg-amber-50 text-amber-700 ring-amber-200",
        accent: "text-amber-600",
        bg: "bg-amber-500",
    },
    blocked: {
        icon: CircleAlert,
        label: "Blocked",
        badge: "bg-red-50 text-red-700 ring-red-200",
        accent: "text-red-600",
        bg: "bg-red-500",
    },
};

interface Props {
    reading: ModelReadingListItem;
    onClose: () => void;
}

export default function ReadingDetailModal({ reading, onClose }: Props) {
    const [detail, setDetail] = useState<ModelReadingDetailResponse | null>(null);
    const [isFetching, setIsFetching] = useState(true);
    const [imageError, setImageError] = useState(false);

    const config = STATUS_CONFIG[reading.blockage_status] ?? STATUS_CONFIG.clear;
    const StatusIcon = config.icon;

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.body.style.overflow = "hidden";
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.body.style.overflow = "unset";
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [onClose]);

    useEffect(() => {
        setIsFetching(true);
        setImageError(false);
        modelReadingLogAPI
            .getDetail(reading.id)
            .then(setDetail)
            .catch(() => setDetail(null))
            .finally(() => setIsFetching(false));
    }, [reading.id]);

    return createPortal(
        <div
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-2 backdrop-blur-sm sm:items-center sm:p-4"
            onClick={onClose}
        >
            <div
                className="max-h-[94vh] w-full max-w-5xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {isFetching ? (
                    <ModalSkeleton onClose={onClose} />
                ) : !detail ? (
                    <div className="p-8 text-center">
                        <p className="text-sm text-gray-500">Failed to load detection detail.</p>
                        <button onClick={onClose} className="mt-4 text-sm text-primary hover:underline">
                            Close
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Header */}
                        <div className="flex items-start justify-between gap-3 px-3 pt-3 sm:px-5 sm:pt-5">
                            <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center">
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ring-1 ${config.badge}`}>
                                    <StatusIcon className="w-3.5 h-3.5" />
                                    {config.label}
                                </span>
                                <span className="truncate text-sm font-medium text-gray-500">
                                    Detection #{detail.id}
                                </span>
                            </div>
                            <button
                                onClick={onClose}
                                className="shrink-0 p-1.5 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                                aria-label="Close detection detail"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Image section */}
                        <div className="px-3 pt-3 sm:px-5 sm:pt-4">
                            {imageError ? (
                                <div className="flex min-h-56 w-full flex-col items-center justify-center bg-gray-100 text-gray-400 sm:min-h-72">
                                    <ImageOff className="w-10 h-10 mb-2" />
                                    <span className="text-sm">Image unavailable</span>
                                </div>
                            ) : (
                                <div className="flex w-full items-center justify-center overflow-auto bg-gray-100">
                                    <img
                                        src={detail.image_path}
                                        alt={`Detection #${detail.id}`}
                                        className="max-h-[48vh] w-full object-contain sm:max-h-[58vh]"
                                        onError={() => setImageError(true)}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Content */}
                        <div className="space-y-3 p-3 sm:space-y-5 sm:p-5">
                            {/* Metrics grid */}
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <MetricCard
                                    label="Blockage Level"
                                    value={`${detail.blockage_percentage.toFixed(1)}%`}
                                    icon={<ProgressRing percentage={detail.blockage_percentage} color={config.bg} />}
                                />
                                <MetricCard
                                    label="Camera"
                                    value={`Device ${detail.camera_device_id}`}
                                    icon={<Camera className="w-5 h-5 text-gray-500" />}
                                />
                            </div>

                            {/* Timestamps */}
                            <div className="flex flex-col gap-3 sm:flex-row">
                                <TimestampCard
                                    label="Detected"
                                    timestamp={detail.timestamp}
                                    icon={<Clock className="w-3.5 h-3.5" />}
                                />
                                <TimestampCard
                                    label="Recorded"
                                    timestamp={detail.created_at}
                                    icon={<Clock className="w-3.5 h-3.5" />}
                                />
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>,
        document.body,
    );
}

function MetricCard({ label, value, icon, subtitle }: { label: string; value: string; icon: React.ReactNode; subtitle?: string }) {
    return (
        <div className="flex min-w-0 flex-col gap-2 rounded-xl bg-gray-50 p-3 sm:p-3.5">
            <div className="flex items-center justify-between">
                <span className="text-[0.68rem] font-medium text-gray-400 uppercase tracking-wide">{label}</span>
                {icon}
            </div>
            <span className="break-words text-lg font-bold text-gray-800 sm:text-xl">{value}</span>
            {subtitle && <span className="text-[0.68rem] text-gray-400 -mt-1">{subtitle}</span>}
        </div>
    );
}

function TimestampCard({ label, timestamp, icon }: { label: string; timestamp: string; icon: React.ReactNode }) {
    return (
        <div className="flex flex-1 items-center gap-3 rounded-xl bg-gray-50 px-3 py-3 sm:px-3.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-200/70 text-gray-500">
                {icon}
            </div>
            <div className="min-w-0">
                <p className="text-[0.68rem] font-medium text-gray-400 uppercase tracking-wide">{label}</p>
                <p className="truncate text-sm font-semibold text-gray-700">
                    {format(new Date(timestamp), "MMM d, yyyy")}
                </p>
                <p className="text-xs text-gray-400">
                    {format(new Date(timestamp), "h:mm:ss a")}
                </p>
            </div>
        </div>
    );
}

function ProgressRing({ percentage, color }: { percentage: number; color: string }) {
    const clamped = Math.min(Math.max(percentage, 0), 100);
    const circumference = 2 * Math.PI * 14;
    const offset = circumference - (clamped / 100) * circumference;

    return (
        <svg width="28" height="28" viewBox="0 0 32 32">
            <circle cx="16" cy="16" r="14" fill="none" stroke="#e5e7eb" strokeWidth="3" />
            <circle
                cx="16" cy="16" r="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                transform="rotate(-90 16 16)"
                className={color}
            />
        </svg>
    );
}

function ModalSkeleton({ onClose }: { onClose: () => void }) {
    return (
        <>
            <div className="flex items-center justify-between gap-3 px-3 pt-3 sm:px-5 sm:pt-5">
                <div className="skeleton h-8 w-44 rounded-full" />
                <button
                    onClick={onClose}
                    className="shrink-0 p-1.5 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                    aria-label="Close detection detail"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
            <div className="px-3 pt-3 sm:px-5 sm:pt-4">
                <div className="skeleton h-[48vh] max-h-[34rem] w-full rounded-none sm:h-[58vh]" />
            </div>
            <div className="space-y-3 p-3 sm:space-y-5 sm:p-5">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {[...Array(2)].map((_, i) => (
                        <div key={i} className="skeleton h-24 rounded-xl" />
                    ))}
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                    <div className="skeleton flex-1 h-16 rounded-xl" />
                    <div className="skeleton flex-1 h-16 rounded-xl" />
                </div>
            </div>
        </>
    );
}
