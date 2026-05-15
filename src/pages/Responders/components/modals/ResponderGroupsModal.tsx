import type { Dispatch, SetStateAction } from "react";
import ModalContainer from "../../../../components/common/ModalContainer";
import ResponderPageModalContainer from "./ResponderPageModalContainer";

interface ResponderGroupsModalProps {
    setModalOpen: Dispatch<SetStateAction<boolean>>;
    responderName: string;
    groups: string[];
}

export default function ResponderGroupsModal({
    setModalOpen,
    responderName,
    groups,
}: ResponderGroupsModalProps) {
    return (
        <ModalContainer setModalOpen={setModalOpen}>
            <ResponderPageModalContainer
                headerText="Responder Groups"
                setModalOpen={setModalOpen}
            >
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-gray-700 dark:text-slate-300">
                        RESPONDER
                    </label>
                    <p className="rounded-lg border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-700/50 px-3 py-2 text-sm text-gray-800 dark:text-slate-200 transition-colors">
                        {responderName}
                    </p>
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-gray-700 dark:text-slate-300">
                        GROUPS ({groups.length})
                    </label>
                    <div className="max-h-72 overflow-auto rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 transition-colors">
                        {groups.map((groupName, index) => (
                            <p
                                key={`${groupName}-${index}`}
                                className="border-b border-gray-200 dark:border-slate-700/50 px-3 py-2 text-sm text-gray-700 dark:text-slate-300 last:border-b-0 transition-colors"
                            >
                                {groupName}
                            </p>
                        ))}
                    </div>
                </div>
            </ResponderPageModalContainer>
        </ModalContainer>
    );
}
