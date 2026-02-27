import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import ModalContainer from "../../../../../components/common/ModalContainer";
import { useToast } from "../../../../../context/ToastContext";
import { useResponders } from "../../../context/RespondersPageContext";
import ResponderPageModalContainer from "../ResponderPageModalContainer";
import AnnounceModalForm from "./components/AnnounceModalForm";
import useAnnounceTemplates from "./hooks/useAnnounceTemplates";
import { notificationAPI } from "../../../../../lib/api/notification";
import type {
    CustomNotificationRequest,
    SendNotificationRequest,
} from "../../../../../types/responder";

export default function AnnounceModal({
    setModalOpen,
    selectedResponderIds,
    onSendSuccess,
}: {
    setModalOpen: Dispatch<SetStateAction<boolean>>;
    selectedResponderIds: string[];
    onSendSuccess?: () => void;
}) {
    const { cache, setCache } = useResponders();
    const { toastSuccess, toastError } = useToast();
    const [selectedTemplateId, setSelectedTemplateId] = useState("");
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState("");

    const { templates, isFetchingTemplates } = useAnnounceTemplates({
        templates: cache.templates,
        setCache,
        toastError,
    });
    const selectedTemplate = templates.find(
        (template) => String(template.id) === selectedTemplateId,
    );

    const handleTemplateChange = (templateId: string) => {
        setError("");
        setSelectedTemplateId(templateId);

        if (!templateId) {
            setTitle("");
            setMessage("");
            return;
        }

        const nextTemplate = templates.find(
            (template) => String(template.id) === templateId,
        );
        setTitle(nextTemplate?.title ?? "");
        setMessage(nextTemplate?.message ?? "");
    };

    const hasSelectedTemplate = Boolean(selectedTemplate);
    const isSendDisabled =
        selectedResponderIds.length === 0 ||
        isSending ||
        (!hasSelectedTemplate && (!title.trim() || !message.trim()));

    const handleAnnounce = async () => {
        if (isSendDisabled) {
            return;
        }

        setError("");
        setIsSending(true);
        try {
            const payload = hasSelectedTemplate
                ? null
                : ({
                      title: title.trim(),
                      message: message.trim(),
                      type: "announcement",
                  } as CustomNotificationRequest);

            await notificationAPI.sendAnnouncement({
                responder_ids: selectedResponderIds,
                template_id: hasSelectedTemplate
                    ? Number(selectedTemplateId)
                    : null,
                custom_notification: payload ?? null,
            } as SendNotificationRequest);

            toastSuccess("Announcement sent successfully.");
            onSendSuccess?.();
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
                headerText="Send Announcement"
                setModalOpen={setModalOpen}
            >
                <AnnounceModalForm
                    templates={templates}
                    selectedTemplateId={selectedTemplateId}
                    onTemplateChange={handleTemplateChange}
                    isFetchingTemplates={isFetchingTemplates}
                    title={title}
                    onTitleChange={setTitle}
                    message={message}
                    onMessageChange={setMessage}
                    hasSelectedTemplate={hasSelectedTemplate}
                    error={error}
                    isSending={isSending}
                    isSendDisabled={isSendDisabled}
                    onCancel={() => setModalOpen(false)}
                    onSend={handleAnnounce}
                />
            </ResponderPageModalContainer>
        </ModalContainer>
    );
}
