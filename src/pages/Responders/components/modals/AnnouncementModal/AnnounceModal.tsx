import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import ModalContainer from "../../../../../components/common/ModalContainer";
import { useToast } from "../../../../../context/ToastContext";
import type {
    NotificationTemplate,
    SendNotificationRequest,
} from "../../../../../types/responder";
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
                template_id: notificationTemplate.id,
                custom_notification: null,
            } as SendNotificationRequest);

            toastSuccess("Announcement sent successfully.");
            setModalOpen(false);
        } catch (error) {
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
