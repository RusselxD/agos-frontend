import { useState } from "react";
import { AlertTriangle, Trash2, X } from "lucide-react";

import ModalContainer from "../../../components/common/ModalContainer";

interface DeleteCenterModalProps {
    centerName: string;
    onClose: () => void;
    onConfirm: () => Promise<void>;
}

export default function DeleteCenterModal({
    centerName,
    onClose,
    onConfirm,
}: DeleteCenterModalProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleConfirm = async () => {
        if (isDeleting) return;

        setIsDeleting(true);
        try {
            await onConfirm();
        } finally {
            setIsDeleting(false);
        }
    };

    const handleClose = () => {
        if (!isDeleting) onClose();
    };

    return (
        <ModalContainer setModalOpen={handleClose}>
            <div
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="delete-center-title"
                aria-describedby="delete-center-description"
                className="mx-4 w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-800"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400">
                            <AlertTriangle className="h-5 w-5" />
                        </div>
                        <div>
                            <h2
                                id="delete-center-title"
                                className="text-lg font-bold text-slate-900 dark:text-slate-100"
                            >
                                Delete evacuation center?
                            </h2>
                            <p className="mt-0.5 text-xs font-medium uppercase tracking-wide text-rose-600 dark:text-rose-400">
                                This action cannot be undone
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={isDeleting}
                        aria-label="Close delete confirmation"
                        className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-100 disabled:opacity-50 dark:text-slate-400 dark:hover:bg-slate-700"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <p
                    id="delete-center-description"
                    className="mt-5 text-sm leading-6 text-slate-600 dark:text-slate-300"
                >
                    You’re about to permanently delete{" "}
                    <span className="font-semibold text-slate-900 dark:text-white">
                        {centerName}
                    </span>
                    .
                </p>

                <div className="mt-6 flex justify-end gap-2 border-t border-slate-200 pt-4 dark:border-slate-700">
                    <button
                        type="button"
                        autoFocus
                        onClick={handleClose}
                        disabled={isDeleting}
                        className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 disabled:opacity-50 dark:text-slate-300 dark:hover:bg-slate-700"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleConfirm}
                        disabled={isDeleting}
                        className="inline-flex min-w-24 items-center justify-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isDeleting ? (
                            <>
                                <div className="spinner h-4 w-4" />
                                Deleting...
                            </>
                        ) : (
                            <>
                                <Trash2 className="h-4 w-4" />
                                Delete
                            </>
                        )}
                    </button>
                </div>
            </div>
        </ModalContainer>
    );
}
