import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode, RefObject } from "react";
import { createPortal } from "react-dom";

interface PopoverProps {
    /** Whether the panel is shown. */
    open: boolean;
    /** Called when the panel should close (outside click / Escape). */
    onClose: () => void;
    /** The element the panel is positioned against (usually the trigger button). */
    anchorRef: RefObject<HTMLElement | null>;
    /** Horizontal edge to align the panel to. Defaults to "left". */
    align?: "left" | "right";
    /** Pixel gap between the anchor and the panel. */
    gap?: number;
    /** Stretch the panel to at least the anchor's width. */
    matchAnchorWidth?: boolean;
    /** Extra classes for the panel wrapper. */
    className?: string;
    children: ReactNode;
}

/**
 * Renders a floating panel into a body-level portal, anchored to `anchorRef`.
 *
 * Portaling escapes parent stacking contexts (e.g. `backdrop-blur` containers)
 * and `overflow` clipping, so the panel always paints above page content.
 * Handles outside-click and Escape dismissal, and repositions on scroll/resize.
 */
export default function Popover({
    open,
    onClose,
    anchorRef,
    align = "left",
    gap = 4,
    matchAnchorWidth = false,
    className = "",
    children,
}: PopoverProps) {
    const panelRef = useRef<HTMLDivElement>(null);
    const [style, setStyle] = useState<CSSProperties>({ visibility: "hidden" });

    // Position the panel against the anchor, and keep it in sync on scroll/resize.
    useLayoutEffect(() => {
        if (!open) return;

        const updatePosition = () => {
            const anchor = anchorRef.current;
            if (!anchor) return;

            const rect = anchor.getBoundingClientRect();
            const next: CSSProperties = {
                position: "fixed",
                top: rect.bottom + gap,
            };

            if (align === "right") {
                next.right = window.innerWidth - rect.right;
            } else {
                next.left = rect.left;
            }
            if (matchAnchorWidth) next.minWidth = rect.width;

            setStyle(next);
        };

        updatePosition();
        // `true` captures scroll on nested scrollable ancestors too.
        window.addEventListener("scroll", updatePosition, true);
        window.addEventListener("resize", updatePosition);
        return () => {
            window.removeEventListener("scroll", updatePosition, true);
            window.removeEventListener("resize", updatePosition);
        };
    }, [open, align, gap, matchAnchorWidth, anchorRef]);

    // Dismiss on outside click / Escape.
    useEffect(() => {
        if (!open) return;

        const handlePointerDown = (event: MouseEvent) => {
            const target = event.target as Node;
            if (
                anchorRef.current?.contains(target) ||
                panelRef.current?.contains(target)
            ) {
                return;
            }
            onClose();
        };
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                event.preventDefault();
                event.stopPropagation();
                onClose();
                anchorRef.current?.focus({ preventScroll: true });
            }
        };

        document.addEventListener("mousedown", handlePointerDown);
        // Capture Escape before a parent modal handles it. Closing a dropdown
        // should not also dismiss the modal containing it.
        document.addEventListener("keydown", handleEscape, true);
        return () => {
            document.removeEventListener("mousedown", handlePointerDown);
            document.removeEventListener("keydown", handleEscape, true);
        };
    }, [open, onClose, anchorRef]);

    if (!open) return null;

    return createPortal(
        <div ref={panelRef} style={style} className={`z-50 ${className}`}>
            {children}
        </div>,
        document.body
    );
}
