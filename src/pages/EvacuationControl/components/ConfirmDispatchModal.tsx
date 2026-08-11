import { useState } from "react";
import { AlertTriangle, ShieldCheck, X } from "lucide-react";

import ModalContainer from "../../../components/common/ModalContainer";
import type { EvacuationKind } from "../../../types/evacuation";

interface ConfirmDispatchModalProps {
    kind: EvacuationKind;
    defaultMessage: string;
    isDispatching: boolean;
    setOpen: (open: boolean) => void;
    onConfirm: (message: string) => void;
}

export default function ConfirmDispatchModal({
    kind,
    defaultMessage,
    isDispatching,
    setOpen,
    onConfirm,
}: ConfirmDispatchModalProps) {
    const [message, setMessage] = useState(defaultMessage);
    const isEvacuate = kind === "evacuate";

    return (
        <ModalContainer setModalOpen={() => setOpen(false)}>
            <div
                className="w-[92vw] max-w-lg rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div
                            className={`rounded-xl p-2 ${
                                isEvacuate
                                    ? "bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400"
                                    : "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                            }`}
                        >
                            {isEvacuate ? (
                                <AlertTriangle className="w-6 h-6" />
                            ) : (
                                <ShieldCheck className="w-6 h-6" />
                            )}
                        </div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                            {isEvacuate
                                ? "Confirm Public Evacuation"
                                : "Confirm All-Clear"}
                        </h2>
                    </div>
                    <button
                        onClick={() => setOpen(false)}
                        className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"
                        aria-label="Close"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div
                    className={`mb-4 rounded-lg border px-4 py-3 text-sm ${
                        isEvacuate
                            ? "border-rose-300 dark:border-rose-800 bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300"
                            : "border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300"
                    }`}
                >
                    {isEvacuate
                        ? "This sends a push notification to every subscribed resident in this location. Use only when evacuation is genuinely warranted."
                        : "This notifies residents that the threat has subsided. Send only when it is safe."}
                </div>

                <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1">
                    Message
                </label>
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/40"
                />

                <div className="flex justify-end gap-2 pt-4">
                    <button
                        onClick={() => setOpen(false)}
                        className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onConfirm(message.trim())}
                        disabled={isDispatching || !message.trim()}
                        className={`rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-60 ${
                            isEvacuate
                                ? "bg-rose-600 hover:bg-rose-700"
                                : "bg-emerald-600 hover:bg-emerald-700"
                        }`}
                    >
                        {isDispatching
                            ? "Dispatching..."
                            : isEvacuate
                              ? "Dispatch Evacuation"
                              : "Dispatch All-Clear"}
                    </button>
                </div>
            </div>
        </ModalContainer>
    );
}
