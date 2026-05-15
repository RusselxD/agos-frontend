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
            className={`w-full text-left p-4 rounded-xl border transition-all duration-300 ${
                isSelected
                    ? "border-primary dark:border-blue-500 bg-primary/10 dark:bg-blue-500/10 ring-1 ring-primary/20 dark:ring-blue-500/20 shadow-lg scale-[1.02]"
                    : "border-gray-200/50 dark:border-white/5 bg-white/40 dark:bg-white/[0.02] hover:border-gray-300 dark:hover:border-white/20 hover:bg-white/60 dark:hover:bg-white/[0.05] hover:shadow-md"
            }`}
        >
            <div className="flex items-start gap-3">
                {/* Avatar */}
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 text-sm font-semibold">
                    {initials}
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-gray-800 dark:text-slate-200 truncate">
                            {fullName}
                        </h3>
                        <span className={`shrink-0 text-[0.65rem] font-semibold uppercase px-2 py-0.5 rounded-full ring-1 ${
                            responder.status === "active"
                                ? "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 ring-emerald-200 dark:ring-emerald-800/50"
                                : "bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 ring-amber-200 dark:ring-amber-800/50"
                        }`}>
                            {responder.status}
                        </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">{responder.phone_number}</p>

                    {/* Stats row */}
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                            <Send className="w-3 h-3" />
                            {responder.total_sent} sent
                        </span>
                        {responder.total_failed > 0 && (
                            <span className="flex items-center gap-1 text-red-500 dark:text-red-400">
                                <XCircle className="w-3 h-3" />
                                {responder.total_failed} failed
                            </span>
                        )}
                        <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                            <CheckCircle className="w-3 h-3" />
                            {responder.total_acknowledged} ack
                        </span>
                    </div>

                    {lastNotified && (
                        <p className="text-[0.68rem] text-gray-400 dark:text-slate-500 mt-1.5 font-medium">
                            Last notified {lastNotified}
                        </p>
                    )}
                </div>
            </div>
        </button>
    );
}
