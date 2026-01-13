import { useEffect } from "react";
import type { Dispatch, SetStateAction, ReactNode } from "react";

interface ModalProps {
    children: ReactNode;
    setModalOpen: Dispatch<SetStateAction<boolean>>;
}

export default function ModalContainer({ children, setModalOpen }: ModalProps) {
    useEffect(() => {
        // Prevent body scroll when modal is open
        document.body.style.overflow = "hidden";

        return () => {
            // Restore body scroll when modal closes
            document.body.style.overflow = "unset";
        };
    }, []);

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
            onClick={() => setModalOpen(false)}
        >
            {children}
        </div>
    );
}
