import { Bell, BellOff } from "lucide-react";
import type { ResponderListItem } from "../../../../../../types/responder";

interface RecipientsListProps {
    responders: ResponderListItem[];
    count: number;
}

function RecipientChip({ responder }: { responder: ResponderListItem }) {
    return (
        <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
                responder.has_push_subscription
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-gray-200 text-gray-600"
            }`}
            title={
                responder.has_push_subscription
                    ? "Will receive push"
                    : "No push subscription"
            }
        >
            <span>
                {responder.first_name} {responder.last_name}
            </span>
            {responder.has_push_subscription ? (
                <Bell className="h-3 w-3" />
            ) : (
                <BellOff className="h-3 w-3" />
            )}
        </span>
    );
}

export default function RecipientsList({ responders, count }: RecipientsListProps) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">
                RECIPIENTS ({count})
            </label>
            <div className="flex min-h-[3rem] flex-wrap gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5">
                {responders.length === 0 ? (
                    <span className="text-sm text-gray-500">
                        No members in this group
                    </span>
                ) : (
                    responders.map((r) => (
                        <RecipientChip key={r.id} responder={r} />
                    ))
                )}
            </div>
        </div>
    );
}
