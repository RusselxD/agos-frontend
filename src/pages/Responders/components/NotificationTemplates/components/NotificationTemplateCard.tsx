import { useState } from "react";
import type { NotificationTemplate } from "../../../../../types/responder";
import { Megaphone, Pencil, Trash } from "lucide-react";
import NotificationTemplateForm from "../../modals/NotificationTemplateForm";
import AnnounceModal from "../../modals/AnnouncementModal";
import { useResponders } from "../../../context/RespondersPageContext";
import { useToast } from "../../../../../context/ToastContext";
import { notificationTemplatesAPI } from "../../../../../lib/api/notificationTemplate";
import DeleteConfirmationModal from "../../modals/DeleteConfirmationModal";

export default function NotificationTemplateCard({
    notificationTemplate,
}: {
    notificationTemplate: NotificationTemplate;
}) {
    const [templateFormIsOpen, setTemplateFormIsOpen] = useState(false);
    const [announceModalIsOpen, setAnnounceModalIsOpen] = useState(false);
    const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);

    const { toastSuccess, toastError } = useToast();
    const { setCache } = useResponders();

    const handleConfirmDelete = async () => {
        try {
            await notificationTemplatesAPI.deleteNotificationTemplate(
                notificationTemplate.id,
            );

            setCache((prevCache) => ({
                ...prevCache,
                templates: prevCache.templates?.filter(
                    (template) => template.id !== notificationTemplate.id,
                ),
            }));

            toastSuccess("Template deleted successfully.");
            setDeleteModalIsOpen(false);
        } catch (error) {
            toastError("Failed to delete template. Please try again.");
        }
    };

    return (
        <div className="p-3 border border-gray-300 dark:border-slate-600 bg-gray-100 dark:bg-slate-700/30 rounded-lg flex flex-col justify-between relative overflow-hidden transition-colors">
            <div className="flex flex-col gap-2">
                <h3 className="font-medium dark:text-slate-200">{notificationTemplate.title}</h3>
                <p className="text-gray-700 dark:text-slate-400 text-sm">
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
                        {notificationTemplate.type === "announcement" && (
                            <button
                                onClick={() => setDeleteModalIsOpen(true)}
                                className="flex items-center gap-2 btn-custom bg-red-500 hover:bg-red-600 transition-colors text-white py-2.5 px-3"
                            >
                                <Trash className="w-4 h-4" />
                            </button>
                        )}
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

            {deleteModalIsOpen && (
                <DeleteConfirmationModal
                    setModalOpen={setDeleteModalIsOpen}
                    title="Delete Notification Template"
                    description={`Are you sure you want to delete "${notificationTemplate.title}"? This action cannot be undone.`}
                    onConfirm={handleConfirmDelete}
                />
            )}
        </div>
    );
}
