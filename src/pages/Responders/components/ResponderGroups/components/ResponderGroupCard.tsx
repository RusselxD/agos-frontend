import { useState } from "react";
import { Megaphone, Pencil, Trash, Users } from "lucide-react";
import type {
    ResponderGroup,
    ResponderListItem,
} from "../../../../../types/responder";
import { useResponders } from "../../../context/RespondersPageContext";
import { useToast } from "../../../../../context/ToastContext";
import { responderGroupAPI } from "../../../../../lib/api/responderGroup";
import GroupForm from "../../modals/GroupForm";
import GroupDetailsModal from "../../modals/GroupDetailsModal";
import DeleteConfirmationModal from "../../modals/DeleteConfirmationModal";
import AnnounceModal from "../../modals/AnnounceModal";

interface ResponderGroupCardProps {
    responderGroup: ResponderGroup;
}

export default function ResponderGroupCard({
    responderGroup,
}: ResponderGroupCardProps) {
    const { cache, setCache } = useResponders();
    const { toastSuccess, toastError } = useToast();
    const [groupFormIsOpen, setGroupFormIsOpen] = useState(false);
    const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
    const [groupDetailsModalIsOpen, setGroupDetailsModalIsOpen] = useState(false);
    const [announceModalIsOpen, setAnnounceModalIsOpen] = useState(false);

    const isDefaultGroup =
        responderGroup.group_name === "All Active Responders";

    const groupMembers = (cache.responders ?? [])
        .filter((r) => responderGroup.member_ids.includes(r.id))
        .sort((a, b) =>
            `${a.last_name}, ${a.first_name}`.localeCompare(
                `${b.last_name}, ${b.first_name}`,
            ),
        ) as ResponderListItem[];

    const missingMembersCount =
        responderGroup.member_ids.length - groupMembers.length;

    const handleConfirmDelete = async () => {
        try {
            await responderGroupAPI.deleteGroup(responderGroup.id);
            setCache((prev) => ({
                ...prev,
                groups: prev.groups?.filter((g) => g.id !== responderGroup.id),
            }));
            toastSuccess("Responder group deleted successfully.");
            setDeleteModalIsOpen(false);
        } catch {
            toastError("Failed to delete responder group. Please try again.");
        }
    };

    return (
        <div className="flex flex-col gap-2 rounded-md border border-gray-300 dark:border-slate-600 bg-gray-100 dark:bg-slate-700/30 p-3 transition-colors">
            <h3 className="font-medium dark:text-slate-200">{responderGroup.group_name}</h3>

            <div className="flex items-center justify-between gap-2 text-sm">
                <div className="flex items-center gap-2 text-gray-700 dark:text-slate-400">
                    <Users className="h-4 w-4" />
                    <p>{responderGroup.member_ids.length} members</p>
                </div>
                <button
                    type="button"
                    onClick={() => setGroupDetailsModalIsOpen(true)}
                    className="btn-custom rounded-md border border-blue-200 dark:border-blue-500/30 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 text-xs font-medium text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                >
                    View Members
                </button>
            </div>

            <div className="mt-2 flex items-center gap-2">
                <button
                    type="button"
                    onClick={() => setAnnounceModalIsOpen(true)}
                    className={`btn-custom flex h-10 flex-1 items-center gap-2 bg-emerald-500 px-3 text-white transition-colors hover:bg-emerald-600 ${!isDefaultGroup ? "mr-3" : ""}`}
                >
                    <Megaphone className="h-5 w-5" />
                    <span>Announce</span>
                </button>
                {!isDefaultGroup && (
                    <>
                        <button
                            type="button"
                            onClick={() => setGroupFormIsOpen(true)}
                            className="btn-custom flex h-10 w-10 items-center justify-center bg-blue-500 p-3 text-white transition-colors hover:bg-blue-600"
                        >
                            <Pencil className="h-5 w-5" />
                        </button>
                        <button
                            type="button"
                            onClick={() => setDeleteModalIsOpen(true)}
                            className="btn-custom flex h-10 w-10 items-center justify-center bg-red-500 p-3 text-white transition-colors hover:bg-red-600"
                        >
                            <Trash className="h-5 w-5" />
                        </button>
                    </>
                )}
            </div>

            {groupFormIsOpen && (
                <GroupForm
                    setModalOpen={setGroupFormIsOpen}
                    responderGroup={responderGroup}
                />
            )}

            {groupDetailsModalIsOpen && (
                <GroupDetailsModal
                    setModalOpen={setGroupDetailsModalIsOpen}
                    responderGroup={responderGroup}
                    memberResponders={groupMembers}
                    missingMembersCount={missingMembersCount}
                />
            )}

            {announceModalIsOpen && (
                <AnnounceModal
                    setModalOpen={setAnnounceModalIsOpen}
                    selectedResponderIds={responderGroup.member_ids}
                />
            )}

            {deleteModalIsOpen && (
                <DeleteConfirmationModal
                    setModalOpen={setDeleteModalIsOpen}
                    title="Delete Responder Group"
                    description={`Are you sure you want to delete "${responderGroup.group_name}"? This action cannot be undone.`}
                    onConfirm={handleConfirmDelete}
                />
            )}
        </div>
    );
}
