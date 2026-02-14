import { useEffect, useState } from "react";
import { useResponders } from "../context/RespondersPageContext";
import Container from "../../../components/ui/Container";
import type { MessageTemplate } from "../../../types/responder";
import { messageTemplateAPI } from "../../../lib/api/responder";
import { Pencil, Send, Trash } from "lucide-react";
import DeleteConfirmationModal from "./modals/DeleteConfirmationModal";
import MessageTemplateForm from "./modals/MessageTemplateForm";
import QuickSendModal from "./modals/QuickSendModal";
import { useToast } from "../../../context/ToastContext";

const MessageTemplateCard = ({
    messageTemplate,
}: {
    messageTemplate: MessageTemplate;
}) => {
    const [templateFormIsOpen, setTemplateFormIsOpen] = useState(false);
    const [quickSendModalIsOpen, setQuickSendModalIsOpen] = useState(false);
    const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);

    const { toastSuccess, toastError } = useToast();
    const { setCache } = useResponders();

    const handleConfirmDelete = async () => {
        try {
            await messageTemplateAPI.deleteMessageTemplate(messageTemplate.id);

            setCache((prevCache) => ({
                ...prevCache,
                templates: prevCache.templates?.filter(
                    (template) => template.id !== messageTemplate.id,
                ),
            }));

            toastSuccess("Message template deleted successfully.");
            setDeleteModalIsOpen(false);
        } catch (error) {
            toastError("Failed to delete message template. Please try again.");
        }
    };

    return (
        <div className="p-3 border border-gray-300 bg-gray-100 rounded-lg flex flex-col justify-between relative overflow-hidden">
            <div className="flex flex-col gap-2">
                <h3 className="font-medium">{messageTemplate.template_name}</h3>
                <p className="text-gray-700 text-sm">
                    {messageTemplate.template_content}
                </p>
            </div>
            <div className="flex items-center justify-between mt-2">
                <button
                    onClick={() => setQuickSendModalIsOpen(true)}
                    className="flex items-center gap-2 btn-custom bg-emerald-500 hover:bg-emerald-600 transition-colors text-white py-2.5 px-3"
                >
                    <Send className="w-4 h-4" />
                    <span>Quick Send</span>
                </button>
                <div>
                    <div className="flex items-center gap-2">
                        <button
                            className="flex items-center gap-2 btn-custom bg-blue-500 hover:bg-blue-600 transition-colors text-white py-2.5 px-3"
                            onClick={() => setTemplateFormIsOpen(true)}
                        >
                            <Pencil className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setDeleteModalIsOpen(true)}
                            className="flex items-center gap-2 btn-custom bg-red-500 hover:bg-red-600 transition-colors text-white py-2.5 px-3"
                        >
                            <Trash className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {messageTemplate.auto_send_on_critical && (
                <p className="absolute right-0 top-0 text-xs text-white bg-red-500 px-2 py-1 rounded-bl-md">
                    Auto send on critical
                </p>
            )}

            {templateFormIsOpen && (
                <MessageTemplateForm
                    setModalOpen={setTemplateFormIsOpen}
                    messageTemplate={messageTemplate}
                />
            )}

            {quickSendModalIsOpen && (
                <QuickSendModal
                    setModalOpen={setQuickSendModalIsOpen}
                    messageTemplate={messageTemplate}
                />
            )}

            {deleteModalIsOpen && (
                <DeleteConfirmationModal
                    setModalOpen={setDeleteModalIsOpen}
                    title="Delete Message Template"
                    description={`Are you sure you want to delete "${messageTemplate.template_name}"? This action cannot be undone.`}
                    onConfirm={handleConfirmDelete}
                />
            )}
        </div>
    );
};

export default function MessageTemplates() {
    const { cache, setCache } = useResponders();
    const [isFetching, setIsFetching] = useState(false);

    useEffect(() => {
        const fetchTemplates = async () => {
            if (cache.templates !== undefined) {
                return;
            }

            setIsFetching(true);
            try {
                const res = await messageTemplateAPI.getMessageTemplates();
                setCache((prev) => ({ ...prev, templates: res }));
            } catch (error) {
            } finally {
                setIsFetching(false);
            }
        };

        fetchTemplates();
    }, [cache.templates, setCache]);

    if (isFetching) {
        return (
            <div className="pt-4">
                <div className="skeleton rounded-md w-full h-10"></div>
                <div className="grid grid-cols-2 gap-5 mt-5">
                    <div className="skeleton rounded-md w-full h-32"></div>
                    <div className="skeleton rounded-md w-full h-32"></div>
                    <div className="skeleton rounded-md w-full h-32"></div>
                    <div className="skeleton rounded-md w-full h-32"></div>
                    <div className="skeleton rounded-md w-full h-32"></div>
                </div>
            </div>
        );
    }

    return (
        <Container className="flex-1 relative" headerTitle="MESSAGE TEMPLATES">
            <p className="text-gray-700 text-sm absolute top-5 right-5">
                {cache.templates?.length ?? 0} templates
            </p>

            <div className="grid grid-cols-2 gap-5 mt-5">
                {cache.templates?.map((template) => (
                    <MessageTemplateCard
                        key={template.id}
                        messageTemplate={template}
                    />
                ))}
            </div>
        </Container>
    );
}
