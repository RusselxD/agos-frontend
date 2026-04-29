import { useState } from "react";
import AnnounceModal from "../../modals/AnnounceModal";

interface SelectedRespondersBarProps {
    selectedCount: number;
    selectedResponderIds: string[];
    onSendSuccess: () => void;
}

export default function SelectedRespondersBar({
    selectedCount,
    selectedResponderIds,
    onSendSuccess,
}: SelectedRespondersBarProps) {
    const [sendSMSModalIsOpen, setSendSMSModalIsOpen] = useState(false);

    return (
        <>
            <div className="fixed inset-x-0 bottom-24 z-[50] flex justify-center px-3 sm:bottom-6 sm:px-4">
                <div className="flex w-[min(38rem,100%)] items-center justify-between gap-3 rounded-xl border border-blue-200 bg-white px-3 py-3 shadow-xl sm:gap-4 sm:px-4">
                    <p className="min-w-0 text-sm font-medium text-gray-700">
                        {selectedCount} responder
                        {selectedCount > 1 ? "s" : ""} selected
                    </p>

                    <button
                        type="button"
                        onClick={() => setSendSMSModalIsOpen(true)}
                        className="btn-custom shrink-0 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700 sm:px-4"
                    >
                        Announce
                    </button>
                </div>
            </div>

            {sendSMSModalIsOpen && (
                <AnnounceModal
                    setModalOpen={setSendSMSModalIsOpen}
                    selectedResponderIds={selectedResponderIds}
                    onSendSuccess={onSendSuccess}
                />
            )}
        </>
    );
}
