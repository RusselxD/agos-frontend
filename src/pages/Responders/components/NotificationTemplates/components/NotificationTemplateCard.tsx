import { useState } from "react";
import type { NotificationTemplate } from "../../../../../types/responder";
import { Megaphone, Pencil, Trash } from "lucide-react";
import NotificationTemplateForm from "../../modals/NotificationTemplateForm";
import AnnounceModal from "../../modals/AnnounceModal";

// import DeleteConfirmationModal from "./modals/DeleteConfirmationModal";
// import MessageTemplateForm from "./modals/MessageTemplateForm";
// import QuickSendModal from "./modals/QuickSendModal";
// import { useToast } from "../../../context/ToastContext";

export default function NotificationTemplateCard({
    notificationTemplate,
}: {
    notificationTemplate: NotificationTemplate;
}) {
    const [templateFormIsOpen, setTemplateFormIsOpen] = useState(false);
    const [announceModalIsOpen, setAnnounceModalIsOpen] = useState(false);
    // const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);

    // const { toastSuccess, toastError } = useToast();
    // const { setCache } = useResponders();

    // const handleConfirmDelete = async () => {
    //     try {
    //         await messageTemplateAPI.deleteMessageTemplate(messageTemplate.id);

    //         setCache((prevCache) => ({
    //             ...prevCache,
    //             templates: prevCache.templates?.filter(
    //                 (template) => template.id !== messageTemplate.id,
    //             ),
    //         }));

    //         toastSuccess("Message template deleted successfully.");
    //         setDeleteModalIsOpen(false);
    //     } catch (error) {
    //         toastError("Failed to delete message template. Please try again.");
    //     }
    // };

    return (
        <div className="p-3 border border-gray-300 bg-gray-100 rounded-lg flex flex-col justify-between relative overflow-hidden">
            <div className="flex flex-col gap-2">
                <h3 className="font-medium">{notificationTemplate.title}</h3>
                <p className="text-gray-700 text-sm">
                    {notificationTemplate.message}
                </p>
            </div>
            <div className="flex items-center justify-between mt-2">
                {notificationTemplate.type === "announcement" ? (
                    <button
                        onClick={() => setAnnounceModalIsOpen(true)}
                        className="flex items-center gap-2 btn-custom bg-emerald-500 hover:bg-emerald-600 transition-colors text-white py-2.5 px-3"
                    >
                        <Megaphone className="w-4 h-4" />
                        <span>Announce</span>
                    </button>
                ) : (
                    <div></div>
                )}

                <div>
                    <div className="flex items-center gap-2">
                        <button
                            className="flex items-center gap-2 btn-custom bg-blue-500 hover:bg-blue-600 transition-colors text-white py-2.5 px-3"
                            onClick={() => setTemplateFormIsOpen(true)}
                        >
                            <Pencil className="w-4 h-4" />
                        </button>
                        <button
                            // onClick={() => setDeleteModalIsOpen(true)}
                            className="flex items-center gap-2 btn-custom bg-red-500 hover:bg-red-600 transition-colors text-white py-2.5 px-3"
                        >
                            <Trash className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {notificationTemplate.type === "critical" && (
                <p className="absolute right-0 top-0 text-xs text-white bg-red-500 px-2 py-1 rounded-bl-md">
                    Critical Alert
                </p>
            )}
            {notificationTemplate.type === "warning" && (
                <p className="absolute right-0 top-0 text-xs text-white bg-yellow-500 px-2 py-1 rounded-bl-md">
                    Warning Alert
                </p>
            )}
            {notificationTemplate.type === "blockage" && (
                <p className="absolute right-0 top-0 text-xs text-white bg-gray-700 px-2 py-1 rounded-bl-md">
                    Blockage Alert
                </p>
            )}
            {notificationTemplate.type === "announcement" && (
                <p className="absolute right-0 top-0 text-xs text-white bg-blue-500 px-2 py-1 rounded-bl-md">
                    Announcement
                </p>
            )}

            {templateFormIsOpen && (
                <NotificationTemplateForm
                    setModalOpen={setTemplateFormIsOpen}
                    notificationTemplate={notificationTemplate}
                />
            )}

            {announceModalIsOpen && (
                <AnnounceModal
                    setModalOpen={setAnnounceModalIsOpen}
                    notificationTemplate={notificationTemplate}
                />
            )}

            {/* {deleteModalIsOpen && (
                <DeleteConfirmationModal
                    setModalOpen={setDeleteModalIsOpen}
                    title="Delete Message Template"
                    description={`Are you sure you want to delete "${messageTemplate.template_name}"? This action cannot be undone.`}
                    onConfirm={handleConfirmDelete}
                />
            )} */}
        </div>
    );
}
