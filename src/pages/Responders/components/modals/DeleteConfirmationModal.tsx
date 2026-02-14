import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import ModalContainer from "../../../../components/common/ModalContainer";
import ResponderPageModalContainer from "./ResponderPageModalContainer";

interface DeleteConfirmationModalProps {
    setModalOpen: Dispatch<SetStateAction<boolean>>;
    title: string;
    description: string;
    onConfirm: () => Promise<void> | void;
}

export default function DeleteConfirmationModal({
    setModalOpen,
    title,
    description,
    onConfirm,
}: DeleteConfirmationModalProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleConfirm = async () => {
        if (isDeleting) {
            return;
        }

        setIsDeleting(true);
        try {
            await onConfirm();
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <ModalContainer setModalOpen={setModalOpen}>
            <ResponderPageModalContainer
                headerText={title}
                setModalOpen={setModalOpen}
            >
                <p className="text-sm text-gray-700">{description}</p>

                <div className="flex items-center justify-end gap-2 border-t border-gray-200 pt-3 text-sm">
                    <button
                        type="button"
                        className="btn-cancel py-2"
                        onClick={() => setModalOpen(false)}
                        disabled={isDeleting}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleConfirm}
                        disabled={isDeleting}
                        className="btn-custom rounded-lg bg-red-600 text-white hover:bg-red-700 py-2 disabled:hover:bg-red-600"
                    >
                        {isDeleting && <div className="spinner h-4 w-4"></div>}
                        <span>{isDeleting ? "Deleting..." : "Delete"}</span>
                    </button>
                </div>
            </ResponderPageModalContainer>
        </ModalContainer>
    );
}
