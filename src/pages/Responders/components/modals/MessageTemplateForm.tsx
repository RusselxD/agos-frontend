import { useState } from "react";
import type { Dispatch, FormEvent, SetStateAction } from "react";
import ModalContainer from "../../../../components/common/ModalContainer";
import TextInputField from "../../../../components/common/auth/TextInputField";
import { messageTemplateAPI } from "../../../../lib/api/responder";
import type {
    MessageTemplate,
    MessageTemplateCreateRequest,
} from "../../../../types/responder";
import axios from "axios";
import { useResponders } from "../../context/RespondersPageContext";
import { useToast } from "../../../../context/ToastContext";
import ResponderPageModalContainer from "./ResponderPageModalContainer";
import AutoSendToggleOption from "./components/AutoSendToggleOption";

interface MessageTemplateFormProps {
    setModalOpen: Dispatch<SetStateAction<boolean>>;
    messageTemplate?: MessageTemplate;
}

type AutoSendTrigger = "critical" | "warning" | "blocked";

const AUTO_SEND_OPTIONS: {
    value: AutoSendTrigger;
    label: string;
    description: string;
}[] = [
    {
        value: "critical",
        label: "AUTO-SEND WHEN CRITICAL",
        description: "Sends this template automatically for critical alerts.",
    },
    {
        value: "warning",
        label: "AUTO-SEND WHEN WARNING",
        description: "Sends this template automatically for warning alerts.",
    },
    {
        value: "blocked",
        label: "AUTO-SEND WHEN BLOCKED",
        description: "Sends this template automatically when incidents are blocked.",
    },
];

const getInitialAutoSendTrigger = (
    template?: MessageTemplate,
): AutoSendTrigger | null => {
    if (!template) {
        return null;
    }

    if (template.auto_send_on_critical) {
        return "critical";
    }

    if (template.auto_send_on_warning) {
        return "warning";
    }

    if (template.auto_send_on_blocked) {
        return "blocked";
    }

    return null;
};

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
    const [selectedAutoSendTrigger, setSelectedAutoSendTrigger] = useState<
        AutoSendTrigger | null
    >(
        getInitialAutoSendTrigger(messageTemplate),
    );

    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const { setCache } = useResponders();
    const { toastSuccess } = useToast();
    const isEditMode = Boolean(messageTemplate);

    const getPayload = (): MessageTemplateCreateRequest => ({
        template_name: templateName.trim(),
        template_content: templateContent.trim(),
        auto_send_on_critical: selectedAutoSendTrigger === "critical",
        auto_send_on_warning: selectedAutoSendTrigger === "warning",
        auto_send_on_blocked: selectedAutoSendTrigger === "blocked",
    });

    const handleAutoSendToggle = (trigger: AutoSendTrigger) => {
        setSelectedAutoSendTrigger((currentTrigger) =>
            currentTrigger === trigger ? null : trigger,
        );
    };

    const saveTemplate = async (
        payload: MessageTemplateCreateRequest,
    ): Promise<MessageTemplate> => {
        if (isEditMode && messageTemplate) {
            return messageTemplateAPI.updateMessageTemplate(
                messageTemplate.id,
                payload,
            );
        }

        return messageTemplateAPI.createMessageTemplate(payload);
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

            // Re query here to ensure cache.templates is up to date with backend (in case backend modifies/sanitizes content)
            const res = await messageTemplateAPI.getMessageTemplates();
            setCache((prev) => ({ ...prev, templates: res }));

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
                        ? "Edit Message Template"
                        : "New Message Template"
                }
                setModalOpen={setModalOpen}
            >
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <TextInputField
                        value={templateName}
                        setValue={setTemplateName}
                        label="TEMPLATE NAME"
                        placeholder="Enter template name"
                        className="text-sm"
                    />

                    <div className="flex flex-col gap-3">
                        {AUTO_SEND_OPTIONS.map((option) => (
                            <AutoSendToggleOption
                                key={option.value}
                                label={option.label}
                                description={option.description}
                                isSelected={
                                    selectedAutoSendTrigger === option.value
                                }
                                onToggle={() =>
                                    handleAutoSendToggle(option.value)
                                }
                            />
                        ))}
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
            </ResponderPageModalContainer>
        </ModalContainer>
    );
}
