import { useState } from "react";
import type { Dispatch, FormEvent, SetStateAction } from "react";
import ModalContainer from "../../../../components/common/ModalContainer";
import { X } from "lucide-react";
import TextInputField from "../../../../components/common/auth/TextInputField";
import { responderAPI } from "../../../../lib/api/responder";
import type {
    MessageTemplate,
    MessageTemplateCreateRequest,
} from "../../../../types/responder";
import axios from "axios";
import { useResponders } from "../../context/RespondersPageContext";
import { useToast } from "../../../../context/ToastContext";

interface MessageTemplateFormProps {
    setModalOpen: Dispatch<SetStateAction<boolean>>;
    messageTemplate?: MessageTemplate;
}

export default function MessageTemplateForm({
    setModalOpen,
    messageTemplate,
}: MessageTemplateFormProps) {
    const [templateName, setTemplateName] = useState(
        messageTemplate?.template_name || "",
    );
    const [templateContent, setTemplateContent] = useState(
        messageTemplate?.template_content || "",
    );
    const [autoSendCritical, setAutoSendCritical] = useState(
        messageTemplate?.auto_send_on_critical || false,
    );

    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const { setCache } = useResponders();
    const { toastSuccess } = useToast();
    const isEditMode = Boolean(messageTemplate);

    const getPayload = (): MessageTemplateCreateRequest => ({
        template_name: templateName.trim(),
        template_content: templateContent.trim(),
        auto_send_on_critical: autoSendCritical,
    });

    const saveTemplate = async (
        payload: MessageTemplateCreateRequest,
    ): Promise<MessageTemplate> => {
        if (isEditMode && messageTemplate) {
            return responderAPI.updateMessageTemplate(
                messageTemplate.id,
                payload,
            );
        }

        return responderAPI.createMessageTemplate(payload);
    };

    const upsertTemplateInCache = (savedTemplate: MessageTemplate) => {
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
            <div
                className="bg-white rounded-lg shadow-xl p-5 max-w-[95vw] w-[32rem] flex flex-col gap-4"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-lg">
                        {isEditMode
                            ? "Edit Message Template"
                            : "New Message Template"}
                    </h2>
                    <button
                        onClick={() => setModalOpen(false)}
                        className="p-1 text-gray-700 hover:text-black"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <TextInputField
                        value={templateName}
                        setValue={setTemplateName}
                        label="TEMPLATE NAME"
                        placeholder="Enter template name"
                        className="text-sm"
                    />

                    <div className="flex flex-col gap-1 w-full">
                        <label className="flex items-center justify-between w-full">
                            <span className="text-sm text-gray-700 font-semibold">
                                AUTO-SEND WHEN CRITICAL
                            </span>
                            <button
                                type="button"
                                onClick={() =>
                                    setAutoSendCritical((prev) => !prev)
                                }
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                    autoSendCritical
                                        ? "bg-gray-800"
                                        : "bg-gray-300"
                                }`}
                                aria-pressed={autoSendCritical}
                            >
                                <span
                                    className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                                        autoSendCritical
                                            ? "translate-x-5"
                                            : "translate-x-1"
                                    }`}
                                />
                            </button>
                        </label>
                        <p className="text-xs text-gray-600">
                            Sends this template automatically for critical
                            alerts.
                        </p>
                    </div>

                    <label className="flex flex-col w-full">
                        <span className="text-sm text-gray-700 font-semibold">
                            TEMPLATE CONTENT
                        </span>
                        <div className="w-full relative">
                            <textarea
                                value={templateContent}
                                onChange={(e) => {
                                    const nextValue = e.target.value.slice(
                                        0,
                                        150,
                                    );
                                    setTemplateContent(nextValue);
                                }}
                                rows={5}
                                maxLength={150}
                                placeholder="Enter your message here"
                                className="border rounded-md p-2.5 w-full text-sm border-gray-400 focus:outline-none focus:border-gray-500 mt-2"
                            ></textarea>
                        </div>
                        <p className="self-end text-xs text-gray-700">{`${templateContent.length}/150 characters`}</p>
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
                                !templateName.trim() ||
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
            </div>
        </ModalContainer>
    );
}
