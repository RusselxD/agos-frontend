import { Download, Loader2 } from "lucide-react";
import { useState } from "react";
import ChooseDateRangeModal from "./ChooseDateRangeModal";

export default function ExportToExcelButton() {
    const [isExporting, setIsExporting] = useState(false);

    const [modalIsOpen, setModalIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setModalIsOpen(true)}
                disabled={isExporting}
                className="absolute top-3 right-3 btn-custom py-2 text-emerald-600 hover:text-emerald-700"
            >
                {isExporting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                    <Download className="w-5 h-5" />
                )}
                <span>{isExporting ? "Exporting..." : "Export Excel"}</span>
            </button>
            {modalIsOpen && (
                <ChooseDateRangeModal setModalIsOpen={setModalIsOpen} />
            )}
        </>
    );
}
