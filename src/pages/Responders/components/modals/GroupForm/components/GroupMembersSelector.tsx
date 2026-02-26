import { formatPHNumber } from "../../../../../../lib/utils/formatter";
import type { ResponderListItem } from "../../../../../../types/responder";

interface GroupMembersSelectorProps {
    responders: ResponderListItem[];
    selectedMemberIds: string[];
    onToggleMember: (id: string) => void;
    isFetching: boolean;
}

function MembersSkeleton() {
    return (
        <>
            <div className="skeleton h-5 w-full rounded-md"></div>
            <div className="skeleton h-5 w-full rounded-md"></div>
            <div className="skeleton h-5 w-full rounded-md"></div>
            <div className="skeleton h-5 w-full rounded-md"></div>
        </>
    );
}

export default function GroupMembersSelector({
    responders,
    selectedMemberIds,
    onToggleMember,
    isFetching,
}: GroupMembersSelectorProps) {
    return (
        <div className="space-y-1">
            <span className="text-sm font-semibold text-gray-700">
                SELECT ACIVE MEMBERS
            </span>
            <div className="flex max-h-40 flex-col overflow-auto rounded-lg border border-gray-400 p-3">
                {isFetching && <MembersSkeleton />}

                {responders.map((responder) => (
                    <label key={responder.id} className="w-full py-1">
                        <input
                            type="checkbox"
                            value={responder.id}
                            checked={selectedMemberIds.includes(responder.id)}
                            onChange={() => onToggleMember(responder.id)}
                        />
                        <span className="ml-2 text-[0.900rem] text-gray-800">
                            {`${responder.first_name} ${responder.last_name} (${formatPHNumber(responder.phone_number)})`}
                        </span>
                    </label>
                ))}
            </div>
        </div>
    );
}
