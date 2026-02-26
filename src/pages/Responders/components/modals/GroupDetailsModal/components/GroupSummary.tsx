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
                <label className="text-sm font-semibold text-gray-700">
                    GROUP NAME
                </label>
                <p className="rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm text-gray-800">
                    {groupName}
                </p>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm">
                <p className="text-gray-700">Total Members</p>
                <p className="font-semibold text-gray-900">{totalMembers}</p>
            </div>

            {missingMembersCount > 0 && (
                <p className="rounded-md border border-amber-300 bg-amber-100 px-3 py-2 text-sm text-amber-700">
                    {missingMembersCount} member
                    {missingMembersCount > 1 ? "s are" : " is"} currently
                    unavailable in responder records.
                </p>
            )}
        </>
    );
}
