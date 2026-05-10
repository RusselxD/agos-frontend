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
            <div className="fixed inset-x-0 bottom-6 z-[50] flex justify-center px-4">
                <div className="flex w-[min(38rem,100%)] items-center justify-between gap-4 rounded-xl border border-blue-200 bg-white px-4 py-3 shadow-xl">
                    <p className="text-sm font-medium text-gray-700">
                        {selectedCount} responder
                        {selectedCount > 1 ? "s" : ""} selected
                    </p>

                    <button
                        type="button"
                        onClick={() => setSendSMSModalIsOpen(true)}
                        className="btn-custom whitespace-nowrap rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
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
