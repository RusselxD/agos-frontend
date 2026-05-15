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
                        <tr className="rounded-t-md text-neutral dark:text-slate-200">
                            <th className="bg-gray-100/80 dark:bg-white/[0.05] rounded-tl-xl px-4 py-3 text-left font-bold transition-colors uppercase tracking-wider text-[0.65rem] md:text-xs">
                                <input
                                    type="checkbox"
                                    checked={allSelected}
                                    onChange={onToggleSelectAll}
                                    className="h-4 w-4 cursor-pointer rounded border-gray-300 accent-blue-600"
                                />
                            </th>
                            <th className="bg-gray-100/80 dark:bg-white/[0.05] px-4 py-3 text-left font-bold transition-colors uppercase tracking-wider text-[0.65rem] md:text-xs">
                                First Name
                            </th>
                            <th className="bg-gray-100/80 dark:bg-white/[0.05] px-4 py-3 text-left font-bold transition-colors uppercase tracking-wider text-[0.65rem] md:text-xs">
                                Last Name
                            </th>
                            <th className="bg-gray-100/80 dark:bg-white/[0.05] px-4 py-3 text-left font-bold transition-colors uppercase tracking-wider text-[0.65rem] md:text-xs">
                                Phone Number
                            </th>
                            <th className="bg-gray-100/80 dark:bg-white/[0.05] rounded-tr-xl px-4 py-3 text-left font-bold transition-colors uppercase tracking-wider text-[0.65rem] md:text-xs">
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
                                    className={`${index % 2 === 0 ? "bg-white/40 dark:bg-transparent" : "bg-gray-50/50 dark:bg-white/[0.01]"} ${isSelected ? "!bg-blue-50/80 dark:!bg-blue-500/10" : ""} transition-colors text-neutral dark:text-slate-200 hover:bg-gray-100/50 dark:hover:bg-white/[0.03]`}
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
                                    <td className="px-4 py-3 text-gray-700 dark:text-slate-300">
                                        {responder.groups.length === 0 ? (
                                            <p className="text-gray-500 dark:text-slate-400">
                                                No groups
                                            </p>
                                        ) : (
                                            <div className="flex flex-wrap items-center gap-1.5">
                                                {previewGroups.map((groupName) => (
                                                    <span
                                                        key={`${responder.id}-${groupName}`}
                                                        className="max-w-[9.5rem] truncate rounded-full border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-2 py-0.5 text-xs text-gray-700 dark:text-slate-300"
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
                                                        className="btn-custom rounded-full border border-blue-200 dark:border-blue-500/30 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 text-xs font-medium text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
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
                                    className="px-4 py-6 text-center text-gray-500 dark:text-slate-400"
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
