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
                className="btn-custom absolute right-3 top-2.5 px-2 py-2 text-sm text-emerald-600 hover:text-emerald-700 sm:px-4"
            >
                {isExportingToExcel ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                    <Download className="w-5 h-5" />
                )}
                <span className="hidden sm:inline">
                    {isExportingToExcel ? "Exporting..." : "Export Excel"}
                </span>
                <span className="sm:hidden">
                    {isExportingToExcel ? "Exporting" : "Export"}
                </span>
            </button>
            {modalIsOpen && (
                <ChooseDateRangeModal setModalIsOpen={setModalIsOpen} />
            )}
        </>
    );
}
