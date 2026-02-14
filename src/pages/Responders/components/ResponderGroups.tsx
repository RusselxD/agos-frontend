import { useEffect, useMemo, useState } from "react";
import { useResponders } from "../context/RespondersPageContext";
import Container from "../../../components/ui/Container";
import { responderAPI, responderGroupAPI } from "../../../lib/api/responder";
import type { ResponderGroup, ResponderListItem } from "../../../types/responder";
import { Pencil, Send, Trash, Users } from "lucide-react";
import DeleteConfirmationModal from "./modals/DeleteConfirmationModal";
import GroupDetailsModal from "./modals/GroupDetailsModal";
import GroupForm from "./modals/GroupForm";
import SendSMSModal from "./modals/SendSMSModal";
import { useToast } from "../../../context/ToastContext";

const ResponderGroupCard = ({
    responderGroup,
}: {
    responderGroup: ResponderGroup;
}) => {
    const [groupFormIsOpen, setGroupFormIsOpen] = useState(false);
    const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
    const [groupDetailsModalIsOpen, setGroupDetailsModalIsOpen] =
        useState(false);
    const [sendSMSModalIsOpen, setSendSMSModalIsOpen] = useState(false);

    const isDefaultGroup =
        responderGroup.group_name === "All Active Responders";

    const { toastSuccess, toastError } = useToast();

    const { cache, setCache } = useResponders();

    const selectedResponderIds = useMemo(() => {
        const activeResponderIdsSet = new Set(
            (cache.responders ?? [])
                .filter(
                    (responder) => responder.status.toLowerCase() === "active",
                )
                .map((responder) => responder.id),
        );

        return [
            ...new Set(
                responderGroup.member_ids.filter((memberId) =>
                    activeResponderIdsSet.has(memberId),
                ),
            ),
        ];
    }, [cache.responders, responderGroup.member_ids]);

    const groupMembers = useMemo<ResponderListItem[]>(() => {
        const respondersById = new Map(
            (cache.responders ?? []).map((responder) => [
                responder.id,
                responder,
            ]),
        );

        return responderGroup.member_ids
            .map((memberId) => respondersById.get(memberId))
            .filter(
                (
                    responder,
                ): responder is ResponderListItem => responder !== undefined,
            )
            .sort((a, b) =>
                `${a.last_name}, ${a.first_name}`.localeCompare(
                    `${b.last_name}, ${b.first_name}`,
                ),
            );
    }, [cache.responders, responderGroup.member_ids]);

    const missingMembersCount =
        responderGroup.member_ids.length - groupMembers.length;

    const handleConfirmDelete = async () => {
        try {
            await responderGroupAPI.deleteGroup(responderGroup.id);

            setCache((prevCache) => ({
                ...prevCache,
                groups: prevCache.groups?.filter(
                    (group) => group.id !== responderGroup.id,
                ),
            }));

            toastSuccess("Responder group deleted successfully.");
            setDeleteModalIsOpen(false);
        } catch {
            toastError("Failed to delete responder group. Please try again.");
        }
    };

    return (
        <div className="p-3 rounded-md border border-gray-300 bg-gray-100 flex flex-col gap-2">
            <h3 className="font-medium">{responderGroup.group_name}</h3>

            <div className="flex items-center justify-between gap-2 text-sm">
                <div className="flex items-center gap-2 text-gray-700">
                    <Users className="w-4 h-4" />
                    <p>{responderGroup.member_ids.length} members</p>
                </div>
                <button
                    type="button"
                    onClick={() => setGroupDetailsModalIsOpen(true)}
                    className="btn-custom rounded-md border border-blue-200 bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100"
                >
                    View Members
                </button>
            </div>

            <div className="flex items-center gap-2  mt-2">
                <button
                    onClick={() => setSendSMSModalIsOpen(true)}
                    className={`h-10 flex-1 btn-custom bg-emerald-500 hover:bg-emerald-600 transition-colors text-white px-3 ${!isDefaultGroup ? "mr-3" : ""}`}
                >
                    <Send className="w-5 h-5" />
                    <span>Send SMS</span>
                </button>
                {!isDefaultGroup && (
                    <>
                        <button
                            onClick={() => setGroupFormIsOpen(true)}
                            className="flex h-10 w-10 p-3 items-center justify-center btn-custom bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                        >
                            <Pencil className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setDeleteModalIsOpen(true)}
                            className="flex h-10 w-10 p-3 items-center justify-center btn-custom bg-red-500 hover:bg-red-600 transition-colors text-white"
                        >
                            <Trash className="w-5 h-5" />
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

            {sendSMSModalIsOpen && (
                <SendSMSModal
                    setModalOpen={setSendSMSModalIsOpen}
                    selectedResponderIds={selectedResponderIds}
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
};

export default function ResponderGroups() {
    const { cache, setCache } = useResponders();
    const { toastError } = useToast();

    const [isFetching, setIsFetching] = useState(false);

    useEffect(() => {
        const fetchGroups = async () => {
            const shouldFetchResponders = cache.responders === undefined;
            const shouldFetchGroups = cache.groups === undefined;

            if (!shouldFetchResponders && !shouldFetchGroups) {
                return;
            }

            setIsFetching(true);
            try {
                const [respondersRes, groupsRes] = await Promise.all([
                    shouldFetchResponders
                        ? responderAPI.getAllResponders()
                        : Promise.resolve(undefined),
                    shouldFetchGroups
                        ? responderGroupAPI.getAllGroups()
                        : Promise.resolve(undefined),
                ]);

                setCache((prevCache) => ({
                    ...prevCache,
                    responders: respondersRes ?? prevCache.responders,
                    groups: groupsRes ?? prevCache.groups,
                }));
            } catch {
                toastError("Failed to load responder groups. Please try again.");
            } finally {
                setIsFetching(false);
            }
        };

        fetchGroups();
    }, [cache.groups, cache.responders, setCache, toastError]);

    if (isFetching) {
        return (
            <div className="pt-4">
                <div className="skeleton rounded-md w-full h-10"></div>
                <div className="grid grid-cols-2 gap-5 mt-5">
                    <div className="skeleton rounded-md w-full h-32"></div>
                    <div className="skeleton rounded-md w-full h-32"></div>
                    <div className="skeleton rounded-md w-full h-32"></div>
                    <div className="skeleton rounded-md w-full h-32"></div>
                    <div className="skeleton rounded-md w-full h-32"></div>
                </div>
            </div>
        );
    }

    return (
        <Container headerTitle="RESPONDER GROUPS" className="flex-1">
            <div className="grid grid-cols-2 gap-5">
                {cache.groups?.map((group) => {
                    return (
                        <ResponderGroupCard
                            responderGroup={group}
                            key={group.id}
                        />
                    );
                })}
            </div>
        </Container>
    );
}
