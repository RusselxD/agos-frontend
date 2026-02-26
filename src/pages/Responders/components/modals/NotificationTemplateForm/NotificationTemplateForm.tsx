import { useState } from "react";
import type { Dispatch, FormEvent, SetStateAction } from "react";
import ModalContainer from "../../../../../components/common/ModalContainer";
import TextInputField from "../../../../../components/common/auth/TextInputField";
import type {
    NotificationTemplate,
    NotificationTemplateCreateRequest,
    NotificationType,
} from "../../../../../types/responder";
import axios from "axios";
import { useResponders } from "../../../context/RespondersPageContext";
import { useToast } from "../../../../../context/ToastContext";
import ResponderPageModalContainer from "../ResponderPageModalContainer";
import { notificationTemplatesAPI } from "../../../../../lib/api/notificationTemplate";
import {
    getInitialNotifType,
    NOTIF_TYPES,
} from "./constants";
import NotificationTypeSelector from "./components/NotificationTypeSelector";
import NotificationMessageField from "./components/NotificationMessageField";
import FormErrorAlert from "./components/FormErrorAlert";
import FormActions from "./components/FormActions";

interface MessageTemplateFormProps {
    setModalOpen: Dispatch<SetStateAction<boolean>>;
    notificationTemplate?: NotificationTemplate;
}

export default function NotificationTemplateForm({
    setModalOpen,
    notificationTemplate,
}: MessageTemplateFormProps) {
    const [templateTitle, setTemplateTitle] = useState(
        notificationTemplate?.title || "",
    );
    const [templateContent, setTemplateContent] = useState(
        notificationTemplate?.message || "",
    );
    const [selectedType, setSelectedType] = useState<NotificationType>(
        getInitialNotifType(notificationTemplate),
    );

    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const { setCache } = useResponders();
    const { toastSuccess } = useToast();
    const isEditMode = Boolean(notificationTemplate);

    const getPayload = (): NotificationTemplateCreateRequest => ({
        title: templateTitle.trim(),
        message: templateContent.trim(),
        type: selectedType ?? "announcement",
    });

    const handleTypeToggle = (type: NotificationType) => {
        setSelectedType(type);
    };

    const saveTemplate = async (
        payload: NotificationTemplateCreateRequest,
    ): Promise<NotificationTemplate> => {
        if (isEditMode && notificationTemplate) {
            return notificationTemplatesAPI.updateNotificationTemplate(
                notificationTemplate.id,
                payload,
            );
        }

        return notificationTemplatesAPI.createNotificationTemplate(payload);
    };

    const upsertTemplateInCache = (savedTemplate: NotificationTemplate) => {
        setCache((prev) => {
            const existingTemplates = prev.templates ?? [];
            const hasExistingTemplate = existingTemplates.some(
                (template) => template.id === savedTemplate.id,
            );

            const nextTemplates = hasExistingTemplate
                ? existingTemplates.map((template) =>
                      template.id === savedTemplate.id
                          ? savedTemplate
                          : template,
                  )
                : [...existingTemplates, savedTemplate];

            return {
                ...prev,
                templates: nextTemplates,
            };
        });
    };

    const getSubmitErrorMessage = (err: unknown) => {
        if (axios.isAxiosError(err)) {
            return (
                err?.response?.data?.detail ||
                (isEditMode
                    ? "Failed to update template. Please try again."
                    : "Failed to create new template. Please try again.")
            );
        }

        return "An unexpected error occurred. Please try again.";
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError("");
        setIsSaving(true);

        try {
            const savedTemplate = await saveTemplate(getPayload());
            upsertTemplateInCache(savedTemplate);

            // Re query here to ensure cache.templates is up to date with backend (in case backend modifies/sanitizes content)
            const res = await notificationTemplatesAPI.getAllNotification();
            setCache((prev) => ({ ...prev, templates: res }));

            toastSuccess(
                isEditMode
                    ? "Template updated successfully."
                    : "Template created successfully.",
            );
            setModalOpen(false);
        } catch (err) {
            setError(getSubmitErrorMessage(err));
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <ModalContainer setModalOpen={setModalOpen}>
            <ResponderPageModalContainer
                headerText={
                    isEditMode
                        ? "Edit Notification Template"
                        : "New Notification Template"
                }
                setModalOpen={setModalOpen}
            >
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <TextInputField
                        value={templateTitle}
                        setValue={setTemplateTitle}
                        label="NOTIFICATION TITLE"
                        placeholder="Enter notification title"
                        className="text-sm"
                    />

                    <NotificationTypeSelector
                        options={NOTIF_TYPES}
                        selectedType={selectedType}
                        onSelect={handleTypeToggle}
                    />

                    <NotificationMessageField
                        value={templateContent}
                        onChange={setTemplateContent}
                    />

                    {error && <FormErrorAlert message={error} />}

                    <FormActions
                        isSaving={isSaving}
                        isSubmitDisabled={
                            !templateTitle.trim() ||
                            !templateContent.trim() ||
                            isSaving
                        }
                        submitLabel={
                            isEditMode ? "Update Template" : "Save Template"
                        }
                        onCancel={() => setModalOpen(false)}
                    />
                </form>
            </ResponderPageModalContainer>
        </ModalContainer>
    );
}
