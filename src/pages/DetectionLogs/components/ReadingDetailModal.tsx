import { useEffect, useState } from "react";
import { X, ImageOff, CircleCheck, TriangleAlert, CircleAlert, Droplets, Camera, Clock } from "lucide-react";
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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-[44rem] max-h-[90vh] overflow-hidden"
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
                        {/* Image section */}
                        <div className="relative">
                            {imageError ? (
                                <div className="w-full h-64 bg-gray-100 flex flex-col items-center justify-center text-gray-400">
                                    <ImageOff className="w-10 h-10 mb-2" />
                                    <span className="text-sm">Image unavailable</span>
                                </div>
                            ) : (
                                <img
                                    src={detail.image_path}
                                    alt={`Detection #${detail.id}`}
                                    className="w-full h-64 object-cover"
                                    onError={() => setImageError(true)}
                                />
                            )}

                            {/* Overlay gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                            {/* Close button */}
                            <button
                                onClick={onClose}
                                className="absolute top-3 right-3 p-1.5 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>

                            {/* Status badge on image */}
                            <div className="absolute bottom-3 left-4 flex items-center gap-2">
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ring-1 ${config.badge}`}>
                                    <StatusIcon className="w-3.5 h-3.5" />
                                    {config.label}
                                </span>
                                <span className="text-xs text-white/80 font-medium">
                                    Detection #{detail.id}
                                </span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-5 space-y-5">
                            {/* Metrics grid */}
                            <div className="grid grid-cols-3 gap-3">
                                <MetricCard
                                    label="Blockage Level"
                                    value={`${detail.blockage_percentage.toFixed(1)}%`}
                                    icon={<ProgressRing percentage={detail.blockage_percentage} color={config.bg} />}
                                />
                                <MetricCard
                                    label="Debris Detected"
                                    value={String(detail.total_debris_count)}
                                    icon={<Droplets className={`w-5 h-5 ${config.accent}`} />}
                                    subtitle={detail.total_debris_count === 0 ? "No debris found" : `${detail.total_debris_count} object${detail.total_debris_count > 1 ? "s" : ""}`}
                                />
                                <MetricCard
                                    label="Camera"
                                    value={`Device ${detail.camera_device_id}`}
                                    icon={<Camera className="w-5 h-5 text-gray-500" />}
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
        <div className="bg-gray-50 rounded-xl p-3.5 flex flex-col gap-2">
            <div className="flex items-center justify-between">
                <span className="text-[0.68rem] font-medium text-gray-400 uppercase tracking-wide">{label}</span>
                {icon}
            </div>
            <span className="text-xl font-bold text-gray-800">{value}</span>
            {subtitle && <span className="text-[0.68rem] text-gray-400 -mt-1">{subtitle}</span>}
        </div>
    );
}

function TimestampCard({ label, timestamp, icon }: { label: string; timestamp: string; icon: React.ReactNode }) {
    return (
        <div className="flex-1 bg-gray-50 rounded-xl px-3.5 py-3 flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200/70 text-gray-500">
                {icon}
            </div>
            <div>
                <p className="text-[0.68rem] font-medium text-gray-400 uppercase tracking-wide">{label}</p>
                <p className="text-sm font-semibold text-gray-700">
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
            <div className="relative">
                <div className="skeleton w-full h-64 rounded-none" />
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 p-1.5 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
            <div className="p-5 space-y-5">
                <div className="grid grid-cols-3 gap-3">
                    {[...Array(3)].map((_, i) => (
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
