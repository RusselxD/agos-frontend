import { Megaphone } from "lucide-react";

interface ModalActionsProps {
    onCancel: () => void;
    onSend: () => void;
    isSending: boolean;
    sendDisabled: boolean;
}

export default function ModalActions({
    onCancel,
    onSend,
    isSending,
    sendDisabled,
}: ModalActionsProps) {
    return (
        <div className="flex items-center justify-end gap-2 border-t border-gray-200 pt-4 text-sm">
            <button
                type="button"
                className="btn-cancel"
                onClick={onCancel}
            >
                Cancel
            </button>
            <button
                type="button"
                onClick={onSend}
                disabled={sendDisabled}
                className="btn-custom rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:hover:bg-emerald-600"
            >
                {isSending ? (
                    <div className="spinner h-4 w-4" />
                ) : (
                    <Megaphone className="h-4 w-4" />
                )}
                <span>{isSending ? "Sending..." : "Send Now"}</span>
            </button>
        </div>
    );
}
