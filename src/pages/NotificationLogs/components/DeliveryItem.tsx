import { CheckCircle2, Clock, XCircle, MessageSquare } from "lucide-react";
import type { DeliveryLogItem } from "../../../types/notificationLog";
import { format } from "date-fns";

const TYPE_STYLES: Record<string, string> = {
    critical: "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 ring-1 ring-red-200 dark:ring-red-800/50",
    warning: "bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 ring-1 ring-amber-200 dark:ring-amber-800/50",
    blockage: "bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 ring-1 ring-orange-200 dark:ring-orange-800/50",
    announcement: "bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 ring-1 ring-blue-200 dark:ring-blue-800/50",
};

const TYPE_LABELS: Record<string, string> = {
    critical: "Critical",
    warning: "Warning",
    blockage: "Surface Obstruction",
    announcement: "Announcement",
};

const STATUS_CONFIG: Record<string, { icon: typeof CheckCircle2; className: string; label: string }> = {
    sent: { icon: CheckCircle2, className: "text-emerald-600 dark:text-emerald-400", label: "Sent" },
    failed: { icon: XCircle, className: "text-red-500 dark:text-red-400", label: "Failed" },
    pending: { icon: Clock, className: "text-gray-400 dark:text-slate-500", label: "Pending" },
};

interface Props {
    delivery: DeliveryLogItem;
}

export default function DeliveryItemCard({ delivery }: Props) {
    const statusConfig = STATUS_CONFIG[delivery.status] ?? STATUS_CONFIG.pending;
    const StatusIcon = statusConfig.icon;

    return (
        <div className="border border-gray-200/50 dark:border-white/5 bg-white/40 dark:bg-white/[0.02] rounded-lg p-3 text-sm transition-colors">
            {/* Top row: type badge + status */}
            <div className="flex items-center justify-between mb-2">
                <span className={`text-[0.65rem] font-semibold uppercase px-2 py-0.5 rounded-full ${TYPE_STYLES[delivery.type] ?? "bg-gray-100 dark:bg-slate-700/50 text-gray-600 dark:text-slate-400 ring-1 ring-gray-200 dark:ring-slate-700"}`}>
                    {TYPE_LABELS[delivery.type] ?? delivery.type}
                </span>
                <span className={`flex items-center gap-1 text-xs font-medium ${statusConfig.className}`}>
                    <StatusIcon className="w-3.5 h-3.5" />
                    {statusConfig.label}
                </span>
            </div>

            {/* Title & message */}
            <h4 className="font-semibold text-gray-800 dark:text-slate-200 text-[0.82rem] leading-snug">
                {delivery.title}
            </h4>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-1 line-clamp-2">
                {delivery.message}
            </p>

            {/* Error message if failed */}
            {delivery.error_message && (
                <p className="text-xs text-red-500 dark:text-red-400 mt-1.5 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 px-2 py-1 rounded">
                    {delivery.error_message}
                </p>
            )}

            {/* Footer: timestamp + acknowledged */}
            <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-gray-100 dark:border-slate-700/50">
                <span className="text-[0.68rem] text-gray-400 dark:text-slate-500 font-medium">
                    {format(new Date(delivery.dispatched_at), "MMM d, yyyy 'at' h:mm a")}
                </span>

                {delivery.is_acknowledged ? (
                    <span className="flex items-center gap-1 text-[0.68rem] text-emerald-600 dark:text-emerald-400 font-medium">
                        <CheckCircle2 className="w-3 h-3" />
                        Acknowledged
                    </span>
                ) : delivery.status === "sent" ? (
                    <span className="text-[0.68rem] text-gray-400 dark:text-slate-500">
                        Not acknowledged
                    </span>
                ) : null}
            </div>

            {/* Responder note left on acknowledgement */}
            {delivery.acknowledge_message && (
                <div className="mt-2 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 px-2 py-1.5 rounded">
                    <span className="flex items-center gap-1 text-[0.62rem] font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
                        <MessageSquare className="w-3 h-3" />
                        Responder note
                    </span>
                    <p className="text-xs text-gray-600 dark:text-slate-300 mt-0.5">
                        {delivery.acknowledge_message}
                    </p>
                </div>
            )}
        </div>
    );
}
