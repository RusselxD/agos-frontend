import type { NotificationTemplate } from "../../../../../../types/responder";

interface AnnounceModalFormProps {
    templates: NotificationTemplate[];
    selectedTemplateId: string;
    onTemplateChange: (templateId: string) => void;
    isFetchingTemplates: boolean;
    title: string;
    onTitleChange: (title: string) => void;
    message: string;
    onMessageChange: (message: string) => void;
    hasSelectedTemplate: boolean;
    error: string;
    isSending: boolean;
    isSendDisabled: boolean;
    onCancel: () => void;
    onSend: () => void | Promise<void>;
}

const MESSAGE_LENGTH = 150;

export default function AnnounceModalForm({
    templates,
    selectedTemplateId,
    onTemplateChange,
    isFetchingTemplates,
    title,
    onTitleChange,
    message,
    onMessageChange,
    hasSelectedTemplate,
    error,
    isSending,
    isSendDisabled,
    onCancel,
    onSend,
}: AnnounceModalFormProps) {
    return (
        <>
            <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-700 dark:text-slate-300">
                    USE TEMPLATE (OPTIONAL)
                </label>
                <div className="relative">
                    <select
                        value={selectedTemplateId}
                        onChange={(e) => onTemplateChange(e.target.value)}
                        disabled={isFetchingTemplates}
                        className="w-full rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2.5 pr-10 text-sm outline-none focus:border-blue-400 dark:focus:border-blue-500 transition-colors text-neutral dark:text-slate-200"
                    >
                        <option value="">None</option>
                        {templates.map((template) => (
                            <option key={template.id} value={template.id}>
                                {template.title}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-700 dark:text-slate-300">
                    TITLE
                </label>
                <input
                    value={title}
                    onChange={(e) => onTitleChange(e.target.value)}
                    readOnly={hasSelectedTemplate}
                    placeholder={
                        hasSelectedTemplate
                            ? ""
                            : "Select a template or write a custom title"
                    }
                    className={`w-full rounded-lg border border-gray-300 dark:border-slate-600 px-3 py-2.5 text-sm text-gray-800 dark:text-slate-200 outline-none focus:border-blue-400 dark:focus:border-blue-500 transition-colors bg-white dark:bg-slate-800 ${
                        hasSelectedTemplate ? "cursor-not-allowed !bg-gray-100 dark:!bg-slate-700/50" : ""
                    }`}
                />
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-700 dark:text-slate-300">
                    MESSAGE
                </label>
                <textarea
                    value={message}
                    onChange={(e) =>
                        onMessageChange(e.target.value.slice(0, MESSAGE_LENGTH))
                    }
                    readOnly={hasSelectedTemplate}
                    placeholder={
                        hasSelectedTemplate
                            ? ""
                            : "Select a template or write a custom message"
                    }
                    maxLength={MESSAGE_LENGTH}
                    rows={5}
                    className={`w-full rounded-lg border border-gray-300 dark:border-slate-600 p-3 text-sm text-gray-800 dark:text-slate-200 outline-none focus:border-blue-400 dark:focus:border-blue-500 transition-colors bg-white dark:bg-slate-800 ${
                        hasSelectedTemplate ? "cursor-not-allowed !bg-gray-100 dark:!bg-slate-700/50" : ""
                    }`}
                />
                <p className="self-end text-xs text-gray-500 dark:text-slate-400">
                    {message.length}/{MESSAGE_LENGTH} characters
                </p>
            </div>

            {error && (
                <p className="rounded-md border border-red-500 dark:border-red-500/50 bg-red-100 dark:bg-red-900/30 px-3 py-2 text-sm text-red-500 dark:text-red-400">
                    {error}
                </p>
            )}

            <div className="flex items-center justify-end gap-2 border-t border-gray-200 dark:border-slate-700/50 pt-4 text-sm">
                <button type="button" className="btn-cancel" onClick={onCancel}>
                    Cancel
                </button>
                <button
                    type="button"
                    onClick={onSend}
                    disabled={isSendDisabled}
                    className="btn-custom rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:hover:bg-emerald-600"
                >
                    {isSending && <div className="spinner h-4 w-4"></div>}
                    <span>
                        {isSending ? "Sending..." : "Send Announcement"}
                    </span>
                </button>
            </div>
        </>
    );
}
