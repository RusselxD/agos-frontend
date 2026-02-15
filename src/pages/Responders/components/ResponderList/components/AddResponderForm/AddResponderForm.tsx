import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, FormEvent, Dispatch, SetStateAction } from "react";
import { FileSpreadsheet, Plus } from "lucide-react";
import { useResponderList } from "../../context/ResponderListContext";
import { normalizeNumberInput } from "../../../../../../lib/utils/formatter";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { type ResponderEntry, createEmptyResponder } from "./types";
import { parseRowToResponder } from "./fileImportUtils";
import ResponderEntryRow from "./ResponderEntryRow";
import { useToast } from "../../../../../../context/ToastContext";
import { useResponders } from "../../../../context/RespondersPageContext";
import { responderAPI } from "../../../../../../lib/api/responder";

export default function AddResponderForm() {
    const { addResponderFormOpen, setAddResponderFormOpen } =
        useResponderList();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [responders, setResponders] = useState<ResponderEntry[]>([
        createEmptyResponder(),
    ]);
    const [isLoading, setIsLoading] = useState(false);

    const { toastSuccess, toastError } = useToast();
    const { setCache } = useResponders();

    // Reset form when closed
    useEffect(() => {
        if (!addResponderFormOpen) {
            setResponders([createEmptyResponder()]);
        }
    }, [addResponderFormOpen]);

    const updateResponder = (
        index: number,
        field: keyof ResponderEntry,
        value: string,
    ) => {
        setResponders((prev) =>
            prev.map((responder, i) =>
                i === index ? { ...responder, [field]: value } : responder,
            ),
        );
    };

    const handlePhoneNumberChange = (index: number) => (input: string) => {
        normalizeNumberInput(
            input,
            (value) => updateResponder(index, "phoneNumber", value as string),
            (value) =>
                updateResponder(
                    index,
                    "normalizedPhoneNumber",
                    value as string,
                ),
        );
    };

    const createFieldSetter =
        (
            index: number,
            field: keyof ResponderEntry,
        ): Dispatch<SetStateAction<string>> =>
        (value) => {
            updateResponder(index, field, value as string);
        };

    const addResponder = () => {
        setResponders((prev) => [...prev, createEmptyResponder()]);
    };

    const removeResponder = (index: number) => {
        if (responders.length > 1) {
            setResponders((prev) => prev.filter((_, i) => i !== index));
        }
    };

    const isFormValid = responders.every(
        (r) =>
            r.firstName.trim() &&
            r.lastName.trim() &&
            r.normalizedPhoneNumber.length >= 13,
    );

    const handleCancel = () => {
        setAddResponderFormOpen(false);
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const payload = responders.map((r) => ({
                first_name: r.firstName.trim(),
                last_name: r.lastName.trim(),
                phone_number: r.normalizedPhoneNumber,
            }));

            const newResponders =
                await responderAPI.bulkCreateResponders(payload);

            setCache((prev) => ({
                ...prev,
                responders: [...(prev.responders ?? []), ...newResponders],
            }));

            toastSuccess("Responders added successfully!");
            setAddResponderFormOpen(false);
        } catch (error) {
            console.error("Failed to add responders:", error);
            toastError("Failed to add responders. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileImport = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const fileName = file.name.toLowerCase();
        const isCSV = fileName.endsWith(".csv");
        const isExcel = fileName.endsWith(".xlsx") || fileName.endsWith(".xls");

        const processData = (rows: Record<string, string>[]) => {
            const parsed = rows
                .map(parseRowToResponder)
                .filter((r): r is ResponderEntry => r !== null);

            if (parsed.length > 0) {
                // Replace empty form or append to existing entries
                setResponders((prev) => {
                    const hasOnlyEmpty =
                        prev.length === 1 &&
                        !prev[0].firstName &&
                        !prev[0].lastName &&
                        !prev[0].phoneNumber;
                    return hasOnlyEmpty ? parsed : [...prev, ...parsed];
                });
            }
        };

        if (isCSV) {
            Papa.parse<Record<string, string>>(file, {
                header: true,
                skipEmptyLines: true,
                complete: (results) => {
                    processData(results.data);
                },
            });
        } else if (isExcel) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const data = event.target?.result;
                const workbook = XLSX.read(data, { type: "binary" });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const rows = XLSX.utils.sheet_to_json<Record<string, string>>(
                    sheet,
                    { defval: "" },
                );
                processData(rows);
            };
            reader.readAsBinaryString(file);
        }

        // Reset file input so same file can be selected again
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className={`bg-gray-50 rounded-lg border border-gray-200 overflow-hidden transition-all duration-200 flex flex-col ${
                addResponderFormOpen ? "flex-1 p-4" : "max-h-0 p-0 border-0"
            }`}
        >
            <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                {responders.map((responder, index) => (
                    <ResponderEntryRow
                        key={index}
                        firstName={responder.firstName}
                        lastName={responder.lastName}
                        phoneNumber={responder.phoneNumber}
                        normalizedPhoneNumber={responder.normalizedPhoneNumber}
                        setFirstName={createFieldSetter(index, "firstName")}
                        setLastName={createFieldSetter(index, "lastName")}
                        handlePhoneNumberChange={handlePhoneNumberChange(index)}
                        onRemove={() => removeResponder(index)}
                        canRemove={responders.length > 1}
                    />
                ))}
            </div>

            <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={addResponder}
                        className="text-gray-600 hover:text-blue-600 font-medium hover:bg-blue-50 btn-custom"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add Another</span>
                    </button>

                    <span className="text-gray-300">|</span>

                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-gray-600 hover:text-green-600 hover:bg-green-50 btn-custom"
                    >
                        <FileSpreadsheet className="w-4 h-4" />
                        <span>Import from File</span>
                    </button>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".csv,.xlsx,.xls"
                        onChange={handleFileImport}
                        className="hidden"
                    />
                </div>

                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="btn-cancel text-sm py-2"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={!isFormValid || isLoading}
                        className="btn-custom bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm py-2 disabled:hover:bg-blue-600"
                    >
                        {isLoading && <div className="spinner w-4 h-4"></div>}
                        <span>
                            {responders.length > 1
                                ? `Add ${responders.length} Responders`
                                : "Add Responder"}
                        </span>
                    </button>
                </div>
            </div>
        </form>
    );
}
