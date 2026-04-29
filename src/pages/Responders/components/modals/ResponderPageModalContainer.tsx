import { X } from "lucide-react";
import type { Dispatch, ReactNode, SetStateAction } from "react";

interface ResponderPageModalContainerProps {
    headerText: string;
    setModalOpen: Dispatch<SetStateAction<boolean>>;
    children: ReactNode;
}

export default function ResponderPageModalContainer({
    headerText,
    setModalOpen,
    children,
}: ResponderPageModalContainerProps) {
    return (
        <div
            className="flex max-h-[92vh] w-full flex-col gap-4 overflow-y-auto rounded-lg bg-white p-4 shadow-xl sm:w-[36rem] sm:max-w-[95vw] sm:p-5"
            onClick={(e) => e.stopPropagation()}
        >
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">{headerText}</h2>
                <button
                    onClick={() => setModalOpen(false)}
                    className="p-1 text-gray-700 hover:text-black"
                >
                    <X className="h-5 w-5" />
                </button>
            </div>
            {children}
        </div>
    );
}
