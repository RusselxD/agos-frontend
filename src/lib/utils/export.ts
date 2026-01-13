import ExcelJS from "exceljs";

interface Column {
    header: string;
    key: string;
    width?: number;
}

interface ExportOptions {
    fileName: string;
    sheetName?: string;
    columns?: Column[];
    headerStyle?: {
        font?: Partial<ExcelJS.Font>;
        fill?: Partial<ExcelJS.Fill>;
        alignment?: Partial<ExcelJS.Alignment>;
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
): Promise<void> => {
    const {
        fileName,
        sheetName = "Sheet1",
        columns,
        headerStyle = {},
        autoFilter = true,
        freezeHeader = true,
    } = options;

    try {
        // Create workbook and worksheet
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(sheetName);

        // Set columns
        if (columns) {
            worksheet.columns = columns;
        } else if (data.length > 0) {
            // Auto-generate columns from first data object
            const firstRow = data[0];
            worksheet.columns = Object.keys(firstRow).map((key) => ({
                header: formatColumnHeader(key),
                key: key,
                width: 15,
            }));
        }

        // Add data rows
        worksheet.addRows(data);

        // Style header row
        const headerRow = worksheet.getRow(1);
        headerRow.font = { bold: true, ...headerStyle.font };
        headerRow.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFE0E0E0" },
            ...headerStyle.fill,
        } as ExcelJS.Fill;
        headerRow.alignment = {
            vertical: "middle",
            horizontal: "center",
            ...headerStyle.alignment,
        };
        headerRow.height = 25;

        // Add borders and alignment to all cells
        worksheet.eachRow((row) => {
            row.eachCell((cell) => {
                cell.border = {
                    top: { style: "thin" },
                    left: { style: "thin" },
                    bottom: { style: "thin" },
                    right: { style: "thin" },
                };
                cell.alignment = {
                    vertical: "middle",
                    horizontal: "center",
                };
            });
        });

        // Enable auto filter
        if (autoFilter && data.length > 0) {
            worksheet.autoFilter = {
                from: { row: 1, column: 1 },
                to: { row: 1, column: worksheet.columns.length },
            };
        }

        // Freeze header row
        if (freezeHeader) {
            worksheet.views = [{ state: "frozen", ySplit: 1 }];
        }

        // Generate buffer and download
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName.endsWith(".xlsx")
            ? fileName
            : `${fileName}.xlsx`;
        link.click();
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error("Error exporting to Excel:", error);
        throw error;
    }
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
