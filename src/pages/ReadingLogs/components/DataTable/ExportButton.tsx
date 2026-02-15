import { Download } from "lucide-react";
import ExcelJS from "exceljs";
import { useState } from "react";
import { useReadingLogs } from "../../context/ReadingLogsContext";
import { useToast } from "../../../../context/ToastContext";
import { downloadExcelFile, exportToExcel } from "../../../../lib/utils/export";

const columns = [
    { header: "Date", key: "summary_date", width: 15 },
    { header: "Min Risk Score", key: "min_risk_score", width: 15 },
    { header: "Max Risk Score", key: "max_risk_score", width: 15 },
    { header: "Min Risk Timestamp", key: "min_risk_timestamp", width: 25 },
    { header: "Max Risk Timestamp", key: "max_risk_timestamp", width: 25 },
    { header: "Min Debris Count", key: "min_debris_count", width: 18 },
    { header: "Max Debris Count", key: "max_debris_count", width: 18 },
    {
        header: "Least Severe Blockage",
        key: "least_severe_blockage",
        width: 20,
    },
    { header: "Most Severe Blockage", key: "most_severe_blockage", width: 20 },
    { header: "Min Water Level (cm)", key: "min_water_level_cm", width: 20 },
    { header: "Max Water Level (cm)", key: "max_water_level_cm", width: 20 },
    { header: "Min Water Timestamp", key: "min_water_timestamp", width: 25 },
    { header: "Max Water Timestamp", key: "max_water_timestamp", width: 25 },
    {
        header: "Min Precipitation (mm)",
        key: "min_precipitation_mm",
        width: 22,
    },
    {
        header: "Max Precipitation (mm)",
        key: "max_precipitation_mm",
        width: 22,
    },
];

export default function ExportButton() {
    const { summaries } = useReadingLogs();
    const { toastSuccess, toastError } = useToast();
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = async () => {
        if (summaries.length === 0) {
            toastError("No data to export");
            return;
        }

        try {
            setIsExporting(true);
            const workBook: ExcelJS.Workbook = await exportToExcel(summaries, {
                columns,
            });

            const today = new Date().toISOString().split("T")[0];
            downloadExcelFile(workBook, `Daily_Analysis_Logs_${today}.xlsx`);
            toastSuccess("Export completed successfully");
        } catch (error) {
            console.error("Export failed:", error);
            toastError("Failed to export data");
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <button
            onClick={handleExport}
            disabled={isExporting || summaries.length === 0}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
            <Download className="w-4 h-4" />
            {isExporting ? "Exporting..." : "Export"}
        </button>
    );
}
