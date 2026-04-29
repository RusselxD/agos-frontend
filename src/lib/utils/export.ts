import * as XLSX from "xlsx";
import type { WorkBook } from "xlsx";

interface Column {
    header: string;
    key: string;
    width?: number;
}

export interface ExportOptions {
    sheetName?: string;
    columns?: Column[];
    headerStyle?: {
        font?: Record<string, unknown>;
        fill?: Record<string, unknown>;
        alignment?: Record<string, unknown>;
    };
    autoFilter?: boolean;
    freezeHeader?: boolean;
}

// interface MultiSheetData {
//     name: string;
//     data: any[];
//     columns?: Column[];
// }

const formatColumnHeader = (key: string): string => {
    const words = key.replace(/_/g, " ").split(" ");
    return words
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
};

/**
 * Export data to Excel file
 * @param data - Array of objects to export
 * @param options - Configuration options
 */
export const exportToExcel = async (
    data: any[],
    options: ExportOptions
): Promise<WorkBook> => {
    const {
        sheetName = "Sheet1",
        columns,
        autoFilter = true,
        freezeHeader = true,
    } = options;

    try {
        const resolvedColumns =
            columns ??
            (data.length > 0
                ? Object.keys(data[0]).map((key) => ({
                      header: formatColumnHeader(key),
                      key,
                      width: 15,
                  }))
                : []);

        const rows = [
            resolvedColumns.map((column) => column.header),
            ...data.map((item) =>
                resolvedColumns.map((column) => item[column.key] ?? ""),
            ),
        ];

        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.aoa_to_sheet(rows);

        worksheet["!cols"] = resolvedColumns.map((column) => ({
            wch: column.width ?? 15,
        }));

        if (autoFilter && resolvedColumns.length > 0 && rows.length > 1) {
            worksheet["!autofilter"] = {
                ref: XLSX.utils.encode_range({
                    s: { r: 0, c: 0 },
                    e: { r: rows.length - 1, c: resolvedColumns.length - 1 },
                }),
            };
        }

        if (freezeHeader) {
            worksheet["!freeze"] = { xSplit: 0, ySplit: 1 };
        }

        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
        return workbook;
    } catch (error) {
        console.error("Error processing Excel file:", error);
        throw error;
    }
};

export const downloadExcelFile = async (
    workbook: WorkBook,
    fileName: string
) => {
    const buffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
    });
    const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName.endsWith(".xlsx") ? fileName : `${fileName}.xlsx`;
    link.click();
    window.URL.revokeObjectURL(url);
};

// /**
//  * Export multiple sheets to one Excel file
//  * @param sheets - Array of sheet objects with name, data, and optional columns
//  * @param fileName - Name of the output file
//  */
// export const exportMultipleSheets = async (
//     sheets: MultiSheetData[],
//     fileName: string
// ): Promise<void> => {
//     try {
//         const workbook = new ExcelJS.Workbook();

//         sheets.forEach(({ name, data, columns }) => {
//             const worksheet = workbook.addWorksheet(name);

//             // Set columns
//             if (columns) {
//                 worksheet.columns = columns;
//             } else if (data.length > 0) {
//                 const firstRow = data[0];
//                 worksheet.columns = Object.keys(firstRow).map((key) => ({
//                     header: key.charAt(0).toUpperCase() + key.slice(1),
//                     key: key,
//                     width: 15,
//                 }));
//             }

//             // Add rows
//             worksheet.addRows(data);

//             // Style header
//             const headerRow = worksheet.getRow(1);
//             headerRow.font = { bold: true };
//             headerRow.fill = {
//                 type: "pattern",
//                 pattern: "solid",
//                 fgColor: { argb: "FFE0E0E0" },
//             } as ExcelJS.Fill;
//             headerRow.alignment = { vertical: "middle", horizontal: "center" };
//             headerRow.height = 25;

//             // Borders
//             worksheet.eachRow((row) => {
//                 row.eachCell((cell) => {
//                     cell.border = {
//                         top: { style: "thin" },
//                         left: { style: "thin" },
//                         bottom: { style: "thin" },
//                         right: { style: "thin" },
//                     };
//                 });
//             });

//             // Auto filter
//             if (data.length > 0) {
//                 worksheet.autoFilter = {
//                     from: { row: 1, column: 1 },
//                     to: { row: 1, column: worksheet.columns.length },
//                 };
//             }

//             // Freeze header
//             worksheet.views = [{ state: "frozen", ySplit: 1 }];
//         });

//         // Download
//         const buffer = await workbook.xlsx.writeBuffer();
//         const blob = new Blob([buffer], {
//             type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//         });
//         const url = window.URL.createObjectURL(blob);
//         const link = document.createElement("a");
//         link.href = url;
//         link.download = fileName.endsWith(".xlsx")
//             ? fileName
//             : `${fileName}.xlsx`;
//         link.click();
//         window.URL.revokeObjectURL(url);
//     } catch (error) {
//         console.error("Error exporting multiple sheets:", error);
//         throw error;
//     }
// };
