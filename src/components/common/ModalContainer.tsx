import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import type { ReactNode } from "react";

interface ModalProps {
    children: ReactNode;
    setModalOpen: (open: boolean) => void;
}

export default function ModalContainer({ children, setModalOpen }: ModalProps) {
    const overlayRef = useRef<HTMLDivElement>(null);
    const setModalOpenRef = useRef(setModalOpen);

    useEffect(() => {
        setModalOpenRef.current = setModalOpen;
    }, [setModalOpen]);

    useEffect(() => {
        const previouslyFocused = document.activeElement as HTMLElement | null;
        const previousBodyOverflow = document.body.style.overflow;
        const getFocusableElements = () => {
            const overlay = overlayRef.current;
            if (!overlay) return [];

            return Array.from(
                overlay.querySelectorAll<HTMLElement>(
                    'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
                ),
            ).filter((element) => element.getClientRects().length > 0);
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.defaultPrevented) return;

            if (event.key === "Escape") {
                event.preventDefault();
                setModalOpenRef.current(false);
                return;
            }

            if (event.key !== "Tab") return;

            const overlay = overlayRef.current;
            const activeElement = document.activeElement as HTMLElement | null;
            if (!overlay || !activeElement || !overlay.contains(activeElement)) {
                return;
            }

            const focusable = getFocusableElements();
            if (focusable.length === 0) {
                event.preventDefault();
                overlay.focus();
                return;
            }

            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (event.shiftKey && activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        };

        document.body.style.overflow = "hidden";
        document.addEventListener("keydown", handleKeyDown);
        const focusFrame = requestAnimationFrame(() => {
            const overlay = overlayRef.current;
            if (!overlay || overlay.contains(document.activeElement)) return;
            (getFocusableElements()[0] ?? overlay).focus({ preventScroll: true });
        });

        return () => {
            cancelAnimationFrame(focusFrame);
            document.body.style.overflow = previousBodyOverflow;
            document.removeEventListener("keydown", handleKeyDown);
            if (previouslyFocused?.isConnected) {
                previouslyFocused.focus({ preventScroll: true });
            }
        };
    }, []);

    return createPortal(
        <div
            ref={overlayRef}
            tabIndex={-1}
            className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
            onClick={() => setModalOpenRef.current(false)}
        >
            {children}
        </div>,
        document.body,
    );
}
