import { Send, CheckCircle, XCircle } from "lucide-react";
import type { ResponderNotificationSummary } from "../../../types/notificationLog";
import { formatDistanceToNow } from "date-fns";

interface Props {
    responder: ResponderNotificationSummary;
    isSelected: boolean;
    onClick: () => void;
}

export default function ResponderSummaryCard({ responder, isSelected, onClick }: Props) {
    const fullName = `${responder.first_name} ${responder.last_name}`;
    const initials = fullName
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((p) => p[0]?.toUpperCase())
        .join("");

    const lastNotified = responder.last_notified_at
        ? formatDistanceToNow(new Date(responder.last_notified_at), { addSuffix: true })
        : null;

    return (
        <button
            onClick={onClick}
            className={`w-full text-left p-3.5 rounded-lg border transition-colors ${
                isSelected
                    ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            }`}
        >
            <div className="flex items-start gap-3">
                {/* Avatar */}
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-sm font-semibold">
                    {initials}
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-gray-800 truncate">
                            {fullName}
                        </h3>
                        <span className={`shrink-0 text-[0.65rem] font-semibold uppercase px-2 py-0.5 rounded-full ${
                            responder.status === "active"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-amber-100 text-amber-700"
                        }`}>
                            {responder.status}
                        </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{responder.phone_number}</p>

                    {/* Stats row */}
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                            <Send className="w-3 h-3" />
                            {responder.total_sent} sent
                        </span>
                        {responder.total_failed > 0 && (
                            <span className="flex items-center gap-1 text-red-500">
                                <XCircle className="w-3 h-3" />
                                {responder.total_failed} failed
                            </span>
                        )}
                        <span className="flex items-center gap-1 text-emerald-600">
                            <CheckCircle className="w-3 h-3" />
                            {responder.total_acknowledged} ack
                        </span>
                    </div>

                    {lastNotified && (
                        <p className="text-[0.68rem] text-gray-400 mt-1.5">
                            Last notified {lastNotified}
                        </p>
                    )}
                </div>
            </div>
        </button>
    );
}
