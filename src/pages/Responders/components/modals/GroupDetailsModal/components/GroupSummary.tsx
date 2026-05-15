interface GroupSummaryProps {
    groupName: string;
    totalMembers: number;
    missingMembersCount: number;
}

export default function GroupSummary({
    groupName,
    totalMembers,
    missingMembersCount,
}: GroupSummaryProps) {
    return (
        <>
            <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-700 dark:text-slate-300">
                    GROUP NAME
                </label>
                <p className="rounded-lg border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-700/50 px-3 py-2.5 text-sm text-gray-800 dark:text-slate-200 transition-colors">
                    {groupName}
                </p>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-slate-700/50 bg-gray-50 dark:bg-slate-700/30 px-3 py-2 text-sm transition-colors">
                <p className="text-gray-700 dark:text-slate-300">Total Members</p>
                <p className="font-semibold text-gray-900 dark:text-slate-100">{totalMembers}</p>
            </div>

            {missingMembersCount > 0 && (
                <p className="rounded-md border border-amber-300 dark:border-amber-500/30 bg-amber-100 dark:bg-amber-900/20 px-3 py-2 text-sm text-amber-700 dark:text-amber-400">
                    {missingMembersCount} member
                    {missingMembersCount > 1 ? "s are" : " is"} currently
                    unavailable in responder records.
                </p>
            )}
        </>
    );
}
