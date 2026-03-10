import { CheckCircle2, Clock, XCircle } from "lucide-react";
import type { DeliveryLogItem } from "../../../types/notificationLog";
import { format } from "date-fns";

const TYPE_STYLES: Record<string, string> = {
    critical: "bg-red-100 text-red-700",
    warning: "bg-amber-100 text-amber-700",
    blockage: "bg-orange-100 text-orange-700",
    announcement: "bg-blue-100 text-blue-700",
};

const STATUS_CONFIG: Record<string, { icon: typeof CheckCircle2; className: string; label: string }> = {
    sent: { icon: CheckCircle2, className: "text-emerald-600", label: "Sent" },
    failed: { icon: XCircle, className: "text-red-500", label: "Failed" },
    pending: { icon: Clock, className: "text-gray-400", label: "Pending" },
};

interface Props {
    delivery: DeliveryLogItem;
}

export default function DeliveryItemCard({ delivery }: Props) {
    const statusConfig = STATUS_CONFIG[delivery.status] ?? STATUS_CONFIG.pending;
    const StatusIcon = statusConfig.icon;

    return (
        <div className="border border-gray-200 rounded-lg p-3 text-sm">
            {/* Top row: type badge + status */}
            <div className="flex items-center justify-between mb-2">
                <span className={`text-[0.65rem] font-semibold uppercase px-2 py-0.5 rounded-full ${TYPE_STYLES[delivery.type] ?? "bg-gray-100 text-gray-600"}`}>
                    {delivery.type}
                </span>
                <span className={`flex items-center gap-1 text-xs font-medium ${statusConfig.className}`}>
                    <StatusIcon className="w-3.5 h-3.5" />
                    {statusConfig.label}
                </span>
            </div>

            {/* Title & message */}
            <h4 className="font-semibold text-gray-800 text-[0.82rem] leading-snug">
                {delivery.title}
            </h4>
            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                {delivery.message}
            </p>

            {/* Error message if failed */}
            {delivery.error_message && (
                <p className="text-xs text-red-500 mt-1.5 bg-red-50 px-2 py-1 rounded">
                    {delivery.error_message}
                </p>
            )}

            {/* Footer: timestamp + acknowledged */}
            <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-gray-100">
                <span className="text-[0.68rem] text-gray-400">
                    {format(new Date(delivery.dispatched_at), "MMM d, yyyy 'at' h:mm a")}
                </span>

                {delivery.is_acknowledged ? (
                    <span className="flex items-center gap-1 text-[0.68rem] text-emerald-600 font-medium">
                        <CheckCircle2 className="w-3 h-3" />
                        Acknowledged
                    </span>
                ) : delivery.status === "sent" ? (
                    <span className="text-[0.68rem] text-gray-400">
                        Not acknowledged
                    </span>
                ) : null}
            </div>
        </div>
    );
}
