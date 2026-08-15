import { useId, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { Check, ChevronDown, Loader2 } from "lucide-react";

import Popover from "../../../components/ui/Popover";
import type { EvacuationCenterStatus } from "../../../types/evacuationCenters";

const STATUS_OPTIONS: EvacuationCenterStatus[] = ["open", "full", "closed"];

const STATUS_STYLES: Record<EvacuationCenterStatus, string> = {
    open: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800",
    full: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-300 dark:border-amber-800",
    closed: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 border-rose-300 dark:border-rose-800",
};

interface CenterStatusSelectProps {
    value: EvacuationCenterStatus;
    onChange: (status: EvacuationCenterStatus) => void;
    variant?: "pill" | "field";
    id?: string;
    disabled?: boolean;
    isLoading?: boolean;
    ariaLabel?: string;
}

const getLabel = (status: EvacuationCenterStatus) =>
    status.charAt(0).toUpperCase() + status.slice(1);

export default function CenterStatusSelect({
    value,
    onChange,
    variant = "field",
    id,
    disabled = false,
    isLoading = false,
    ariaLabel,
}: CenterStatusSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
    const listboxId = useId();
    const isPill = variant === "pill";
    const selectedIndex = STATUS_OPTIONS.indexOf(value);

    const focusOption = (index: number) => {
        requestAnimationFrame(() => optionRefs.current[index]?.focus());
    };

    const openAt = (index: number) => {
        if (disabled) return;
        setIsOpen(true);
        focusOption(index);
    };

    const closeAndFocusTrigger = () => {
        setIsOpen(false);
        requestAnimationFrame(() => triggerRef.current?.focus());
    };

    const focusNextToTrigger = (direction: 1 | -1) => {
        const trigger = triggerRef.current;
        if (!trigger) return;

        const focusable = Array.from(
            document.querySelectorAll<HTMLElement>(
                'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
            ),
        ).filter((element) => element.getClientRects().length > 0);
        const currentIndex = focusable.indexOf(trigger);
        focusable[currentIndex + direction]?.focus();
    };

    const handleTriggerClick = () => {
        if (isOpen) {
            setIsOpen(false);
            return;
        }
        openAt(selectedIndex);
    };

    const handleTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
        if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            openAt(event.key === "ArrowDown" ? selectedIndex : STATUS_OPTIONS.length - 1);
        } else if (event.key === "Escape" && isOpen) {
            event.preventDefault();
            setIsOpen(false);
        }
    };

    const handleOptionKeyDown = (
        event: KeyboardEvent<HTMLButtonElement>,
        index: number,
    ) => {
        if (event.key === "ArrowDown") {
            event.preventDefault();
            focusOption((index + 1) % STATUS_OPTIONS.length);
        } else if (event.key === "ArrowUp") {
            event.preventDefault();
            focusOption((index - 1 + STATUS_OPTIONS.length) % STATUS_OPTIONS.length);
        } else if (event.key === "Home") {
            event.preventDefault();
            focusOption(0);
        } else if (event.key === "End") {
            event.preventDefault();
            focusOption(STATUS_OPTIONS.length - 1);
        } else if (event.key === "Escape") {
            event.preventDefault();
            event.stopPropagation();
            closeAndFocusTrigger();
        } else if (event.key === "Tab") {
            event.preventDefault();
            setIsOpen(false);
            focusNextToTrigger(event.shiftKey ? -1 : 1);
        }
    };

    const handleSelect = (status: EvacuationCenterStatus) => {
        if (status !== value) onChange(status);
        closeAndFocusTrigger();
    };

    return (
        <>
            <button
                ref={triggerRef}
                id={id}
                type="button"
                aria-controls={listboxId}
                aria-expanded={isOpen}
                aria-haspopup="listbox"
                aria-label={ariaLabel}
                disabled={disabled}
                onClick={handleTriggerClick}
                onKeyDown={handleTriggerKeyDown}
                className={`flex items-center justify-between gap-2 border font-semibold capitalize transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-60 ${
                    isPill
                        ? `rounded-full px-3 py-1 text-xs ${STATUS_STYLES[value]}`
                        : "w-full rounded-lg border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                }`}
            >
                <span>{getLabel(value)}</span>
                {isLoading ? (
                    <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
                ) : (
                    <ChevronDown
                        className={`h-4 w-4 shrink-0 transition-transform ${
                            isOpen ? "rotate-180" : ""
                        }`}
                    />
                )}
            </button>

            <Popover
                open={isOpen}
                onClose={() => setIsOpen(false)}
                anchorRef={triggerRef}
                gap={4}
                matchAnchorWidth
            >
                <div
                    id={listboxId}
                    role="listbox"
                    aria-label={ariaLabel ?? "Evacuation center status"}
                    className="min-w-32 overflow-hidden rounded-xl border border-slate-200 bg-white p-1 shadow-xl dark:border-slate-700 dark:bg-slate-800"
                >
                    {STATUS_OPTIONS.map((status, index) => {
                        const isSelected = status === value;

                        return (
                            <button
                                key={status}
                                ref={(element) => {
                                    optionRefs.current[index] = element;
                                }}
                                type="button"
                                role="option"
                                aria-selected={isSelected}
                                tabIndex={-1}
                                onClick={() => handleSelect(status)}
                                onKeyDown={(event) =>
                                    handleOptionKeyDown(event, index)
                                }
                                className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
                                    isSelected
                                        ? "bg-primary/10 text-primary dark:bg-blue-500/10 dark:text-blue-400"
                                        : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700/60"
                                }`}
                            >
                                <span>{getLabel(status)}</span>
                                {isSelected && <Check className="h-4 w-4" />}
                            </button>
                        );
                    })}
                </div>
            </Popover>
        </>
    );
}
