import type { Dispatch, FormEvent, SetStateAction } from "react";
import { useEffect, useState } from "react";
import ModalContainer from "../../../../components/common/ModalContainer";
import TextInputField from "../../../../components/common/auth/TextInputField";
import { useResponders } from "../../context/RespondersPageContext";
import { responderAPI, responderGroupAPI } from "../../../../lib/api/responder";
import { formatPHNumber } from "../../../../lib/utils/formatter";
import { useToast } from "../../../../context/ToastContext";
import ResponderPageModalContainer from "./ResponderPageModalContainer";
import type {
    ResponderGroup,
    ResponderGroupCreateRequest,
} from "../../../../types/responder";
import axios from "axios";

const MembersSkeleton = () => {
    return (
        <>
            <div className="skeleton h-5 w-full rounded-md"></div>
            <div className="skeleton h-5 w-full rounded-md"></div>
            <div className="skeleton h-5 w-full rounded-md"></div>
            <div className="skeleton h-5 w-full rounded-md"></div>
        </>
    );
};

interface GroupFormProps {
    setModalOpen: Dispatch<SetStateAction<boolean>>;
    responderGroup?: ResponderGroup;
}

export default function GroupForm({
    setModalOpen,
    responderGroup,
}: GroupFormProps) {
    const [groupName, setGroupName] = useState(
        responderGroup?.group_name || "",
    );
    const [memberIDs, setMemberIDs] = useState<string[]>(
        responderGroup?.member_ids || [],
    );

    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const { cache, setCache } = useResponders();
    const { toastSuccess } = useToast();
    const isEditMode = Boolean(responderGroup);

    useEffect(() => {
        const fetchResponders = async () => {
            if (cache.responders !== undefined) {
                return;
            }

            setIsFetching(true);
            try {
                const res = await responderAPI.getAllResponders();
                setCache((prevCache) => ({
                    ...prevCache,
                    responders: res,
                }));
            } catch (error) {
            } finally {
                setIsFetching(false);
            }
        };

        fetchResponders();
    }, []);

    const handleAddMember = (id: string) => {
        if (memberIDs.includes(id)) {
            setMemberIDs((prevIDs) =>
                prevIDs.filter((prevID) => prevID !== id),
            );
        } else {
            setMemberIDs((prevIDs) => [...prevIDs, id]);
        }
    };

    const getPayload = (): ResponderGroupCreateRequest => ({
        group_name: groupName.trim(),
        member_ids: memberIDs,
    });

    const saveGroup = async (
        payload: ResponderGroupCreateRequest,
    ): Promise<ResponderGroup> => {
        if (isEditMode && responderGroup) {
            return responderGroupAPI.updateGroup(responderGroup.id, payload);
        }

        return responderGroupAPI.createGroup(payload);
    };

    const upsertGroupInCache = (savedGroup: ResponderGroup) => {
        setCache((prev) => {
            const existingGroups = prev.groups ?? [];
            const hasExistingGroup = existingGroups.some(
                (group) => group.id === savedGroup.id,
            );

            const nextGroups = hasExistingGroup
                ? existingGroups.map((group) =>
                      group.id === savedGroup.id ? savedGroup : group,
                  )
                : [...existingGroups, savedGroup];

            return {
                ...prev,
                groups: nextGroups,
            };
        });
    };

    const getSubmitErrorMessage = (err: unknown) => {
        if (axios.isAxiosError(err)) {
            return (
                err?.response?.data?.detail ||
                (isEditMode
                    ? "Failed to update group. Please try again."
                    : "Failed to create new group. Please try again.")
            );
        }

        return "An unexpected error occurred. Please try again.";
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError("");
        setIsSaving(true);

        try {
            const savedGroup = await saveGroup(getPayload());
            upsertGroupInCache(savedGroup);

            toastSuccess(
                isEditMode
                    ? "Group updated successfully!"
                    : "Group created successfully!",
            );
            setModalOpen(false);
        } catch (err) {
            setError(getSubmitErrorMessage(err));
        } finally {
            setIsSaving(false);
        }
    };

    const activeResponders =
        cache.responders?.filter(
            (responder) => responder.status.toLowerCase() === "active",
        ) ?? [];

    return (
        <ModalContainer setModalOpen={setModalOpen}>
            <ResponderPageModalContainer
                headerText={isEditMode ? "Edit Group" : "Create New Group"}
                setModalOpen={setModalOpen}
            >
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <TextInputField
                        value={groupName}
                        setValue={setGroupName}
                        label="GROUP NAME"
                        placeholder="Enter group name"
                        className="text-sm"
                    />

                    <div className="space-y-1">
                        <span className="text-sm text-gray-700 font-semibold">
                            SELECT ACIVE MEMBERS
                        </span>
                        <div className="border border-gray-400 rounded-lg p-3 flex flex-col overflow-auto max-h-40">
                            {isFetching && <MembersSkeleton />}

                            {activeResponders.map((responder) => {
                                return (
                                    <label
                                        key={responder.id}
                                        className="w-full py-1"
                                    >
                                        <input
                                            type="checkbox"
                                            value={responder.id}
                                            checked={memberIDs.includes(
                                                responder.id,
                                            )}
                                            onChange={() =>
                                                handleAddMember(responder.id)
                                            }
                                        />
                                        <span className="ml-2 text-[0.900rem] text-gray-800">{`${responder.first_name} ${responder.last_name} (${formatPHNumber(responder.phone_number)})`}</span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>

                    {error && (
                        <p className="text-sm text-red-500 bg-red-100 border rounded-md border-red-500 py-2 px-3">
                            {error}
                        </p>
                    )}

                    <div className="text-sm flex items-center justify-end gap-2">
                        <button
                            type="button"
                            className="btn-cancel"
                            onClick={() => setModalOpen(false)}
                        >
                            Cancel
                        </button>
                        <button
                            disabled={
                                !groupName.trim() ||
                                memberIDs.length === 0 ||
                                isSaving
                            }
                            type="submit"
                            className="btn-custom bg-primary text-white hover:bg-primary/90 disabled:hover:bg-primary"
                        >
                            {isSaving && (
                                <div className="spinner w-4 h-4"></div>
                            )}
                            <span>
                                {isEditMode ? "Update Group" : "Create Group"}
                            </span>
                        </button>
                    </div>
                </form>
            </ResponderPageModalContainer>
        </ModalContainer>
    );
}
