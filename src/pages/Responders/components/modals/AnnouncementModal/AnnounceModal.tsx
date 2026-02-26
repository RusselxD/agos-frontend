import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import ModalContainer from "../../../../../components/common/ModalContainer";
import { useToast } from "../../../../../context/ToastContext";
import type { NotificationTemplate } from "../../../../../types/responder";
import { useResponders } from "../../../context/RespondersPageContext";
import ResponderPageModalContainer from "../ResponderPageModalContainer";
import { notificationAPI } from "../../../../../lib/api/notification";
import useAnnounceRecipients from "./hooks/useAnnounceRecipients";
import AnnounceModalForm from "./components/AnnounceModalForm";

interface AnnounceModalProps {
    setModalOpen: Dispatch<SetStateAction<boolean>>;
    notificationTemplate: NotificationTemplate;
}

export default function AnnounceModal({
    setModalOpen,
    notificationTemplate,
}: AnnounceModalProps) {
    const { cache } = useResponders();
    const { toastSuccess } = useToast();
    const [confirmSend, setConfirmSend] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState("");

    const {
        groups,
        selectedGroupId,
        setSelectedGroupId,
        selectedGroup,
        responderIds,
        selectedResponders,
        isFetching,
    } = useAnnounceRecipients();

    const isSendDisabled =
        isFetching ||
        isSending ||
        !selectedGroup ||
        !confirmSend ||
        !notificationTemplate.message.trim();

    const handleAnnounce = async () => {
        if (isSendDisabled) return;

        setError("");
        setIsSending(true);
        try {
            await notificationAPI.sendAnnouncement({
                responder_ids: responderIds,
                notif_template:
                    cache.templates?.find(
                        (t) => t.id === notificationTemplate.id,
                    ) ?? notificationTemplate,
            });

            toastSuccess("Announcement sent successfully.");
            setModalOpen(false);
        } catch {
            setError("Failed to send announcement. Please try again.");
        } finally {
            setIsSending(false);
        }
    };

    return (
        <ModalContainer setModalOpen={setModalOpen}>
            <ResponderPageModalContainer
                headerText="Announce Confirmation"
                setModalOpen={setModalOpen}
            >
                <AnnounceModalForm
                    template={notificationTemplate}
                    groups={groups}
                    selectedGroupId={selectedGroupId}
                    setSelectedGroupId={setSelectedGroupId}
                    responderIds={responderIds}
                    selectedResponders={selectedResponders}
                    confirmSend={confirmSend}
                    setConfirmSend={setConfirmSend}
                    error={error}
                    isFetching={isFetching}
                    isSending={isSending}
                    isSendDisabled={isSendDisabled}
                    onAnnounce={handleAnnounce}
                    onCancel={() => setModalOpen(false)}
                />
            </ResponderPageModalContainer>
        </ModalContainer>
    );
}
