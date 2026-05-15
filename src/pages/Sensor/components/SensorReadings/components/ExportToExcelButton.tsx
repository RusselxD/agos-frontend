import { Download, Loader2 } from "lucide-react";
import { useState } from "react";
import ChooseDateRangeModal from "./ChooseDateRangeModal";
import { useCoreHook } from "../../../../../context/CoreContext";

export default function ExportToExcelButton() {
    const { isExportingToExcel } = useCoreHook();

    const [modalIsOpen, setModalIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setModalIsOpen(true)}
                disabled={isExportingToExcel}
                className="absolute top-3 right-3 btn-custom py-2 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
            >
                {isExportingToExcel ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                    <Download className="w-5 h-5" />
                )}
                <span>
                    {isExportingToExcel ? "Exporting..." : "Export Excel"}
                </span>
            </button>
            {modalIsOpen && (
                <ChooseDateRangeModal setModalIsOpen={setModalIsOpen} />
            )}
        </>
    );
}
