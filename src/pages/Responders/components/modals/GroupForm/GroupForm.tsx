import type { Dispatch, FormEvent, SetStateAction } from "react";
import { useState } from "react";
import ModalContainer from "../../../../../components/common/ModalContainer";
import TextInputField from "../../../../../components/common/auth/TextInputField";
import { useResponders } from "../../../context/RespondersPageContext";
import { useToast } from "../../../../../context/ToastContext";
import ResponderPageModalContainer from "../ResponderPageModalContainer";
import type {
    ResponderGroup,
    ResponderGroupCreateRequest,
} from "../../../../../types/responder";
import axios from "axios";
import { responderGroupAPI } from "../../../../../lib/api/responderGroup";
import GroupMembersSelector from "./components/GroupMembersSelector";
import FormActions from "./components/FormActions";
import FormErrorAlert from "./components/FormErrorAlert";
import useGroupResponders from "./hooks/useGroupResponders";

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

    useGroupResponders({
        responders: cache.responders,
        setCache,
        setIsFetching,
    });

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

                    <GroupMembersSelector
                        responders={activeResponders}
                        selectedMemberIds={memberIDs}
                        onToggleMember={handleAddMember}
                        isFetching={isFetching}
                    />

                    {error && <FormErrorAlert message={error} />}

                    <FormActions
                        isSaving={isSaving}
                        isSubmitDisabled={
                            !groupName.trim() ||
                            memberIDs.length === 0 ||
                            isSaving
                        }
                        submitLabel={isEditMode ? "Update Group" : "Create Group"}
                        onCancel={() => setModalOpen(false)}
                    />
                </form>
            </ResponderPageModalContainer>
        </ModalContainer>
    );
}
