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
        badge: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 ring-emerald-200 dark:ring-emerald-800/50",
        accent: "text-emerald-600 dark:text-emerald-400",
        bg: "bg-emerald-500",
    },
    partial: {
        icon: TriangleAlert,
        label: "Partial Blockage",
        badge: "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 ring-amber-200 dark:ring-amber-800/50",
        accent: "text-amber-600 dark:text-amber-400",
        bg: "bg-amber-500",
    },
    blocked: {
        icon: CircleAlert,
        label: "Blocked",
        badge: "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 ring-red-200 dark:ring-red-800/50",
        accent: "text-red-600 dark:text-red-400",
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
            className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-colors"
            onClick={onClose}
        >
            <div
                className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[92vh] overflow-y-auto border border-white/10 dark:border-slate-800 transition-colors"
                onClick={(e) => e.stopPropagation()}
            >
                {isFetching ? (
                    <ModalSkeleton onClose={onClose} />
                ) : !detail ? (
                    <div className="p-8 text-center">
                        <p className="text-sm text-gray-500 dark:text-slate-400">Failed to load detection detail.</p>
                        <button onClick={onClose} className="mt-4 text-sm text-primary dark:text-blue-400 hover:underline">
                            Close
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Header */}
                        <div className="flex items-center justify-between gap-3 px-5 pt-5">
                            <div className="flex items-center gap-2 min-w-0">
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ring-1 ${config.badge}`}>
                                    <StatusIcon className="w-3.5 h-3.5" />
                                    {config.label}
                                </span>
                                <span className="text-sm font-medium text-gray-500 dark:text-slate-400">
                                    Detection #{detail.id}
                                </span>
                            </div>
                            <button
                                onClick={onClose}
                                className="shrink-0 p-1.5 rounded-full text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-700 dark:hover:text-slate-200 transition-colors"
                                aria-label="Close detection detail"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Image section */}
                        <div className="px-5 pt-4">
                            {imageError ? (
                                <div className="w-full min-h-72 bg-gray-100 dark:bg-slate-950 flex flex-col items-center justify-center text-gray-400 dark:text-slate-600 transition-colors">
                                    <ImageOff className="w-10 h-10 mb-2" />
                                    <span className="text-sm">Image unavailable</span>
                                </div>
                            ) : (
                                <div className="w-full bg-gray-100 dark:bg-slate-950 flex items-center justify-center overflow-auto rounded-lg border border-gray-200 dark:border-slate-800 transition-colors">
                                    <img
                                        src={detail.image_path}
                                        alt={`Detection #${detail.id}`}
                                        className="max-h-[58vh] w-full object-contain"
                                        onError={() => setImageError(true)}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Content */}
                        <div className="p-5 space-y-5">
                            {/* Metrics grid */}
                            <div className="grid grid-cols-2 gap-3">
                                <MetricCard
                                    label="Blockage Level"
                                    value={`${detail.blockage_percentage.toFixed(1)}%`}
                                    icon={<ProgressRing percentage={detail.blockage_percentage} color={config.bg} />}
                                />
                                <MetricCard
                                    label="Camera"
                                    value={`Device ${detail.camera_device_id}`}
                                    icon={<Camera className="w-5 h-5 text-gray-500 dark:text-slate-400" />}
                                />
                            </div>

                            {/* Timestamps */}
                            <div className="flex gap-3">
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
        <div className="bg-gray-50 dark:bg-slate-800/50 rounded-xl p-3.5 flex flex-col gap-2 border border-transparent dark:border-slate-700/50">
            <div className="flex items-center justify-between">
                <span className="text-[0.68rem] font-medium text-gray-400 dark:text-slate-500 uppercase tracking-wide">{label}</span>
                {icon}
            </div>
            <span className="text-xl font-bold text-gray-800 dark:text-slate-200">{value}</span>
            {subtitle && <span className="text-[0.68rem] text-gray-400 dark:text-slate-500 -mt-1">{subtitle}</span>}
        </div>
    );
}

function TimestampCard({ label, timestamp, icon }: { label: string; timestamp: string; icon: React.ReactNode }) {
    return (
        <div className="flex-1 bg-gray-50 dark:bg-slate-800/50 rounded-xl px-3.5 py-3 flex items-center gap-3 border border-transparent dark:border-slate-700/50">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200/70 dark:bg-slate-700 text-gray-500 dark:text-slate-400">
                {icon}
            </div>
            <div>
                <p className="text-[0.68rem] font-medium text-gray-400 dark:text-slate-500 uppercase tracking-wide">{label}</p>
                <p className="text-sm font-semibold text-gray-700 dark:text-slate-300">
                    {format(new Date(timestamp), "MMM d, yyyy")}
                </p>
                <p className="text-xs text-gray-400 dark:text-slate-500">
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
            <circle cx="16" cy="16" r="14" fill="none" stroke="currentColor" strokeWidth="3" className="text-gray-100 dark:text-slate-700" />
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
            <div className="flex items-center justify-between gap-3 px-5 pt-5">
                <div className="skeleton h-8 w-44 rounded-full" />
                <button
                    onClick={onClose}
                    className="shrink-0 p-1.5 rounded-full text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-700 dark:hover:text-slate-200 transition-colors"
                    aria-label="Close detection detail"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
            <div className="px-5 pt-4">
                <div className="skeleton w-full h-[58vh] max-h-[34rem] rounded-none" />
            </div>
            <div className="p-5 space-y-5">
                <div className="grid grid-cols-2 gap-3">
                    {[...Array(2)].map((_, i) => (
                        <div key={i} className="skeleton h-24 rounded-xl" />
                    ))}
                </div>
                <div className="flex gap-3">
                    <div className="skeleton flex-1 h-16 rounded-xl" />
                    <div className="skeleton flex-1 h-16 rounded-xl" />
                </div>
            </div>
        </>
    );
}
