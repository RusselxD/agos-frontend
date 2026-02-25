import { useState } from "react";
import type { Dispatch, FormEvent, SetStateAction } from "react";
import ModalContainer from "../../../../components/common/ModalContainer";
import TextInputField from "../../../../components/common/auth/TextInputField";
import type {
    NotificationTemplate,
    NotificationTemplateCreateRequest,
    NotificationType,
} from "../../../../types/responder";
import axios from "axios";
import { useResponders } from "../../context/RespondersPageContext";
import { useToast } from "../../../../context/ToastContext";
import ResponderPageModalContainer from "./ResponderPageModalContainer";
import { notificationTemplatesAPI } from "../../../../lib/api/notificationTemplate";
import { capitalizeFirstLetter } from "../../../../lib/utils/formatter";

interface MessageTemplateFormProps {
    setModalOpen: Dispatch<SetStateAction<boolean>>;
    notificationTemplate?: NotificationTemplate;
}

const NOTIF_TYPES: {
    value: NotificationType;
    label: string;
}[] = [
    {
        value: "critical",
        label: "This will be sent when a critical alert is detected.",
    },
    {
        value: "warning",
        label: "This will be sent when a warning alert is detected.",
    },
    {
        value: "blockage",
        label: "This will be sent when a blockage is detected.",
    },
    {
        value: "announcement",
        label: "Use this template for announcements / manual sending.",
    },
];

const MESSAGE_LENGTH = 120;

const getInitialNotifType = (
    template?: NotificationTemplate,
): NotificationType => {
    if (!template) {
        return "announcement";
    }

    if (template.type === "critical") {
        return "critical";
    }

    if (template.type === "warning") {
        return "warning";
    }

    if (template.type === "blockage") {
        return "blockage";
    }

    return "announcement";
};

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

                    <div className="flex flex-col gap-2">
                        <span className="text-sm text-gray-700 font-semibold">
                            NOTIFICATION TYPE
                        </span>
                        <div>
                            {NOTIF_TYPES.map((type) => (
                                <button
                                    type="button"
                                    key={type.value}
                                    onClick={() => handleTypeToggle(type.value)}
                                    className={`px-4 py-2 rounded-md mr-2 text-sm ${selectedType === type.value ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"} `}
                                >
                                    {capitalizeFirstLetter(type.value)}
                                </button>
                            ))}
                        </div>
                        <span className="text-[0.800rem] mt-1 text-gray-600">
                            {
                                NOTIF_TYPES.find(
                                    (t) => t.value === selectedType,
                                )?.label
                            }
                        </span>
                    </div>

                    <label className="flex flex-col w-full">
                        <span className="text-sm text-gray-700 font-semibold">
                            NOTIFICATION MESSAGE
                        </span>
                        <div className="w-full relative">
                            <textarea
                                value={templateContent}
                                onChange={(e) => {
                                    const nextValue = e.target.value.slice(
                                        0,
                                        MESSAGE_LENGTH,
                                    );
                                    setTemplateContent(nextValue);
                                }}
                                rows={5}
                                maxLength={MESSAGE_LENGTH}
                                placeholder="Enter your message here"
                                className="border rounded-md p-2.5 w-full text-sm border-gray-400 focus:outline-none focus:border-gray-500 mt-2"
                            ></textarea>
                        </div>
                        <p className="self-end text-xs text-gray-700">{`${templateContent.length}/${MESSAGE_LENGTH} characters`}</p>
                    </label>

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
                                !templateTitle.trim() ||
                                !templateContent.trim() ||
                                isSaving
                            }
                            type="submit"
                            className="btn-custom bg-primary text-white hover:bg-primary/90 disabled:hover:bg-primary"
                        >
                            {isSaving && (
                                <div className="spinner w-4 h-4"></div>
                            )}
                            <span>
                                {isEditMode
                                    ? "Update Template"
                                    : "Save Template"}
                            </span>
                        </button>
                    </div>
                </form>
            </ResponderPageModalContainer>
        </ModalContainer>
    );
}
