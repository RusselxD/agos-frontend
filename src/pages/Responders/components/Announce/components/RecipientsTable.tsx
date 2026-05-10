import { useState } from "react";
import { formatPHNumber } from "../../../../../lib/utils/formatter";
import ResponderGroupsModal from "../../modals/ResponderGroupsModal";
import type { AnnounceResponderRow } from "../Announce";

const GROUP_PREVIEW_COUNT = 2;

interface RecipientsTableProps {
    responders: AnnounceResponderRow[];
    selectedResponderIds: string[];
    allSelected: boolean;
    onToggleResponder: (responderId: string) => void;
    onToggleSelectAll: () => void;
}

export default function RecipientsTable({
    responders,
    selectedResponderIds,
    allSelected,
    onToggleResponder,
    onToggleSelectAll,
}: RecipientsTableProps) {
    const [groupsModalIsOpen, setGroupsModalIsOpen] = useState(false);
    const [selectedResponderGroups, setSelectedResponderGroups] = useState<{
        responderName: string;
        groups: string[];
    }>({
        responderName: "",
        groups: [],
    });

    const handleOpenGroupsModal = (
        responderName: string,
        responderGroups: string[],
    ) => {
        setSelectedResponderGroups({
            responderName,
            groups: responderGroups,
        });
        setGroupsModalIsOpen(true);
    };

    return (
        <>
            <div className="w-full overflow-x-auto pb-2">
                <table className="w-full table-fixed min-w-[40rem] border-collapse text-left text-sm whitespace-nowrap">
                    <colgroup>
                        <col className="w-[5%]" />
                        <col className="w-[20%]" />
                        <col className="w-[20%]" />
                        <col className="w-[20%]" />
                        <col className="w-[35%]" />
                    </colgroup>
                    <thead>
                        <tr className="rounded-t-md">
                            <th className="bg-background rounded-tl-md px-4 py-3 text-left font-medium">
                                <input
                                    type="checkbox"
                                    checked={allSelected}
                                    onChange={onToggleSelectAll}
                                    className="h-4 w-4 cursor-pointer rounded border-gray-300 accent-blue-600"
                                />
                            </th>
                            <th className="bg-background px-4 py-3 text-left font-medium">
                                First Name
                            </th>
                            <th className="bg-background px-4 py-3 text-left font-medium">
                                Last Name
                            </th>
                            <th className="bg-background px-4 py-3 text-left font-medium">
                                Phone Number
                            </th>
                            <th className="bg-background rounded-tr-md px-4 py-3 text-left font-medium">
                                Groups
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {responders.map((responder, index) => {
                            const isSelected = selectedResponderIds.includes(
                                responder.id,
                            );
                            const previewGroups = responder.groups.slice(
                                0,
                                GROUP_PREVIEW_COUNT,
                            );
                            const hiddenGroupsCount = Math.max(
                                responder.groups.length - GROUP_PREVIEW_COUNT,
                                0,
                            );

                            return (
                                <tr
                                    key={responder.id}
                                    className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} ${isSelected ? "!bg-blue-50" : ""}`}
                                >
                                    <td className="px-4 py-3">
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={() =>
                                                onToggleResponder(responder.id)
                                            }
                                            className="h-4 w-4 cursor-pointer rounded border-gray-300 accent-blue-600"
                                        />
                                    </td>
                                    <td className="px-4 py-3">
                                        {responder.first_name}
                                    </td>
                                    <td className="px-4 py-3">
                                        {responder.last_name}
                                    </td>
                                    <td className="px-4 py-3">
                                        {formatPHNumber(responder.phone_number)}
                                    </td>
                                    <td className="px-4 py-3 text-gray-700">
                                        {responder.groups.length === 0 ? (
                                            <p className="text-gray-500">
                                                No groups
                                            </p>
                                        ) : (
                                            <div className="flex flex-wrap items-center gap-1.5">
                                                {previewGroups.map((groupName) => (
                                                    <span
                                                        key={`${responder.id}-${groupName}`}
                                                        className="max-w-[9.5rem] truncate rounded-full border border-gray-200 bg-white px-2 py-0.5 text-xs text-gray-700"
                                                        title={groupName}
                                                    >
                                                        {groupName}
                                                    </span>
                                                ))}

                                                {hiddenGroupsCount > 0 && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleOpenGroupsModal(
                                                                `${responder.first_name} ${responder.last_name}`,
                                                                responder.groups,
                                                            )
                                                        }
                                                        className="btn-custom rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 hover:bg-blue-100"
                                                    >
                                                        +{hiddenGroupsCount} more
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}

                        {responders.length === 0 && (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="px-4 py-6 text-center text-gray-500"
                                >
                                    No active responders available.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {groupsModalIsOpen && (
                <ResponderGroupsModal
                    setModalOpen={setGroupsModalIsOpen}
                    responderName={selectedResponderGroups.responderName}
                    groups={selectedResponderGroups.groups}
                />
            )}
        </>
    );
}
