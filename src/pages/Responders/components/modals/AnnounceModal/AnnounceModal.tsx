import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import ModalContainer from "../../../../../components/common/ModalContainer";
import { useToast } from "../../../../../context/ToastContext";
import { responderAPI } from "../../../../../lib/api/responder";
import { useResponders } from "../../../context/RespondersPageContext";
import ResponderPageModalContainer from "../ResponderPageModalContainer";
import AnnounceModalForm from "./components/AnnounceModalForm";
import useAnnounceTemplates from "./hooks/useAnnounceTemplates";

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
            setMessage("");
            return;
        }

        const nextTemplate = templates.find(
            (template) => String(template.id) === templateId,
        );
        setMessage(nextTemplate?.message ?? "");
    };

    const isSendDisabled =
        !message.trim() || selectedResponderIds.length === 0 || isSending;

    const handleSendSMS = async () => {
        if (isSendDisabled) {
            return;
        }

        setError("");
        setIsSending(true);
        try {
            await responderAPI.sendSMS({
                responder_ids: selectedResponderIds,
                message: message.trim(),
            });

            toastSuccess("SMS sent successfully.");
            onSendSuccess?.();
            setModalOpen(false);
        } catch {
            setError("Failed to send SMS. Please try again.");
        } finally {
            setIsSending(false);
        }
    };

    return (
        <ModalContainer setModalOpen={setModalOpen}>
            <ResponderPageModalContainer
                headerText="Send SMS Message"
                setModalOpen={setModalOpen}
            >
                <AnnounceModalForm
                    templates={templates}
                    selectedTemplateId={selectedTemplateId}
                    onTemplateChange={handleTemplateChange}
                    isFetchingTemplates={isFetchingTemplates}
                    message={message}
                    onMessageChange={setMessage}
                    hasSelectedTemplate={Boolean(selectedTemplate)}
                    error={error}
                    isSending={isSending}
                    isSendDisabled={isSendDisabled}
                    onCancel={() => setModalOpen(false)}
                    onSend={handleSendSMS}
                />
            </ResponderPageModalContainer>
        </ModalContainer>
    );
}
