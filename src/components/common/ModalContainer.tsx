import { useEffect } from "react";
import { createPortal } from "react-dom";
import type { Dispatch, SetStateAction, ReactNode } from "react";

interface ModalProps {
    children: ReactNode;
    setModalOpen: Dispatch<SetStateAction<boolean>>;
}

export default function ModalContainer({ children, setModalOpen }: ModalProps) {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setModalOpen(false);
            }
        };

        // Prevent body scroll when modal is open
        document.body.style.overflow = "hidden";
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            // Restore body scroll when modal closes
            document.body.style.overflow = "unset";
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [setModalOpen]);

    return createPortal(
        <div
            className="fixed inset-0 z-50 flex items-end justify-center overflow-y-auto bg-black bg-opacity-40 p-3 sm:items-center"
            onClick={() => setModalOpen(false)}
        >
            {children}
        </div>,
        document.body,
    );
}
