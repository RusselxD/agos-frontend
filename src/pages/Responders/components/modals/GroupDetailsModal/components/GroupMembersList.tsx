import {
    capitalizeFirstLetter,
    formatPHNumber,
} from "../../../../../../lib/utils/formatter";
import type { ResponderListItem } from "../../../../../../types/responder";

interface GroupMembersListProps {
    members: ResponderListItem[];
}

const getStatusClasses = (status: string) => {
    switch (status.toLowerCase()) {
        case "active":
            return "border-green-200 bg-green-100 text-green-700 dark:border-emerald-500/30 dark:bg-emerald-900/20 dark:text-emerald-400";
        case "pending":
            return "border-amber-200 bg-amber-100 text-amber-700 dark:border-amber-500/30 dark:bg-amber-900/20 dark:text-amber-400";
        default:
            return "border-gray-200 bg-gray-100 text-gray-700 dark:border-slate-600 dark:bg-slate-700/50 dark:text-slate-300";
    }
};

export default function GroupMembersList({ members }: GroupMembersListProps) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700 dark:text-slate-300">
                MEMBERS
            </label>

            <div className="max-h-72 overflow-auto rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 transition-colors">
                {members.length === 0 ? (
                    <p className="px-3 py-3 text-sm text-gray-500 dark:text-slate-400">
                        No members found for this group.
                    </p>
                ) : (
                    members.map((member) => (
                        <div
                            key={member.id}
                            className="flex items-center justify-between gap-3 border-b border-gray-200 dark:border-slate-700/50 px-3 py-2 last:border-b-0 transition-colors"
                        >
                            <div className="min-w-0">
                                <p className="truncate text-sm font-medium text-gray-800 dark:text-slate-200">
                                    {member.first_name} {member.last_name}
                                </p>
                                <p className="text-xs text-gray-600 dark:text-slate-400">
                                    {formatPHNumber(member.phone_number)}
                                </p>
                            </div>

                            <span
                                className={`rounded-full border px-2 py-1 text-xs font-medium ${getStatusClasses(
                                    member.status,
                                )}`}
                            >
                                {capitalizeFirstLetter(member.status)}
                            </span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
