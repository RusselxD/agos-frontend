import type { Dispatch, SetStateAction } from "react";
import ModalContainer from "../../../../components/common/ModalContainer";
import {
    capitalizeFirstLetter,
    formatPHNumber,
} from "../../../../lib/utils/formatter";
import type {
    ResponderGroup,
    ResponderListItem,
} from "../../../../types/responder";
import ResponderPageModalContainer from "./ResponderPageModalContainer";

interface GroupDetailsModalProps {
    setModalOpen: Dispatch<SetStateAction<boolean>>;
    responderGroup: ResponderGroup;
    memberResponders: ResponderListItem[];
    missingMembersCount: number;
}

const getStatusClasses = (status: string) => {
    switch (status.toLowerCase()) {
        case "active":
            return "border-green-200 bg-green-100 text-green-700";
        case "pending":
            return "border-amber-200 bg-amber-100 text-amber-700";
        default:
            return "border-gray-200 bg-gray-100 text-gray-700";
    }
};

export default function GroupDetailsModal({
    setModalOpen,
    responderGroup,
    memberResponders,
    missingMembersCount,
}: GroupDetailsModalProps) {
    return (
        <ModalContainer setModalOpen={setModalOpen}>
            <ResponderPageModalContainer
                headerText="Group Details"
                setModalOpen={setModalOpen}
            >
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-gray-700">
                        GROUP NAME
                    </label>
                    <p className="rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm text-gray-800">
                        {responderGroup.group_name}
                    </p>
                </div>

                <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm">
                    <p className="text-gray-700">Total Members</p>
                    <p className="font-semibold text-gray-900">
                        {responderGroup.member_ids.length}
                    </p>
                </div>

                {missingMembersCount > 0 && (
                    <p className="rounded-md border border-amber-300 bg-amber-100 px-3 py-2 text-sm text-amber-700">
                        {missingMembersCount} member
                        {missingMembersCount > 1 ? "s are" : " is"} currently
                        unavailable in responder records.
                    </p>
                )}

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-gray-700">
                        MEMBERS
                    </label>

                    <div className="max-h-72 overflow-auto rounded-lg border border-gray-300 bg-white">
                        {memberResponders.length === 0 ? (
                            <p className="px-3 py-3 text-sm text-gray-500">
                                No members found for this group.
                            </p>
                        ) : (
                            memberResponders.map((member) => (
                                <div
                                    key={member.id}
                                    className="flex items-center justify-between gap-3 border-b border-gray-200 px-3 py-2 last:border-b-0"
                                >
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-medium text-gray-800">
                                            {member.first_name}{" "}
                                            {member.last_name}
                                        </p>
                                        <p className="text-xs text-gray-600">
                                            {formatPHNumber(
                                                member.phone_number,
                                            )}
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
            </ResponderPageModalContainer>
        </ModalContainer>
    );
}
