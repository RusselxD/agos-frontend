import {
    useEffect,
    useRef,
    useState,
    type ChangeEvent,
    type FormEvent,
} from "react";
import { FileSpreadsheet, Plus, Trash2 } from "lucide-react";
import { useResponderList } from "../context/ResponderListContext";
import { normalizeNumberInput } from "../../../../../lib/utils/formatter";

interface ResponderEntry {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    normalizedPhoneNumber: string;
}

const createEmptyResponder = (): ResponderEntry => ({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    normalizedPhoneNumber: "",
});

export default function AddResponderForm() {
    const { addResponderFormOpen, setAddResponderFormOpen } =
        useResponderList();
    const containerRef = useRef<HTMLFormElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [responders, setResponders] = useState<ResponderEntry[]>([
        createEmptyResponder(),
    ]);
    const [isLoading, setIsLoading] = useState(false);

    // Scroll into view when opened
    useEffect(() => {
        if (addResponderFormOpen && containerRef.current) {
            setTimeout(() => {
                const el = containerRef.current;
                if (!el) return;

                const offset = 40;
                const top =
                    el.getBoundingClientRect().top + window.scrollY - offset;

                window.scrollTo({
                    top,
                    behavior: "smooth",
                });
            }, 100);
        }
    }, [addResponderFormOpen]);

    // Reset form when closed (handles both Cancel buttons)
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

    const handlePhoneNumberChange = (index: number, input: string) => {
        const setPhoneNumber = (value: string | ((prev: string) => string)) => {
            const newValue =
                typeof value === "function"
                    ? value(responders[index].phoneNumber)
                    : value;
            updateResponder(index, "phoneNumber", newValue);
        };
        const setNormalizedPhoneNumber = (
            value: string | ((prev: string) => string),
        ) => {
            const newValue =
                typeof value === "function"
                    ? value(responders[index].normalizedPhoneNumber)
                    : value;
            updateResponder(index, "normalizedPhoneNumber", newValue);
        };
        normalizeNumberInput(input, setPhoneNumber, setNormalizedPhoneNumber);
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
        // TODO: Implement submit logic
    };

    const handleFileImport = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // TODO: Implement file parsing logic
        // Expected columns: First Name, Last Name, Phone Number
        // Then call setResponders with parsed data

        // Reset file input so same file can be selected again
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            ref={containerRef}
            className={`bg-gray-50 rounded-lg border border-gray-200 overflow-hidden transition-all duration-200 ${
                addResponderFormOpen
                    ? "max-h-[600px] p-4 mb-4"
                    : "max-h-0 p-0 mb-0 border-0"
            }`}
        >
            <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-1">
                {responders.map((responder, index) => (
                    <div
                        key={index}
                        className="flex items-end gap-3 bg-white p-3 rounded-lg border border-gray-100"
                    >
                        <div className="flex-1 grid grid-cols-3 gap-3">
                            <label className="flex flex-col">
                                <span className="text-xs text-gray-600 font-semibold mb-1">
                                    FIRST NAME
                                </span>
                                <input
                                    type="text"
                                    value={responder.firstName}
                                    onChange={(e) =>
                                        updateResponder(
                                            index,
                                            "firstName",
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Enter first name"
                                    className="custom-input w-full text-sm"
                                />
                            </label>

                            <label className="flex flex-col">
                                <span className="text-xs text-gray-600 font-semibold mb-1">
                                    LAST NAME
                                </span>
                                <input
                                    type="text"
                                    value={responder.lastName}
                                    onChange={(e) =>
                                        updateResponder(
                                            index,
                                            "lastName",
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Enter last name"
                                    className="custom-input w-full text-sm"
                                />
                            </label>

                            <label className="flex flex-col">
                                <span className="text-xs text-gray-600 font-semibold mb-1">
                                    PHONE NUMBER
                                </span>
                                <div className="relative w-full">
                                    <span className="h-8 w-9 text-xs bg-gray-100 rounded-t-sm absolute bottom-0.5 left-0 flex items-center justify-center">
                                        +63
                                    </span>
                                    <input
                                        type="text"
                                        value={responder.phoneNumber}
                                        onChange={(e) =>
                                            handlePhoneNumberChange(
                                                index,
                                                e.target.value,
                                            )
                                        }
                                        placeholder="9XXXXXXXXX"
                                        className="custom-input w-full pl-12 text-sm"
                                        onKeyDown={(e) => {
                                            if (e.ctrlKey || e.metaKey) return;
                                            const allowedKeys = [
                                                "Backspace",
                                                "Delete",
                                                "ArrowLeft",
                                                "ArrowRight",
                                                "Tab",
                                                "Enter",
                                            ];
                                            if (
                                                !allowedKeys.includes(e.key) &&
                                                !/[0-9]/.test(e.key)
                                            ) {
                                                e.preventDefault();
                                            }
                                        }}
                                    />
                                </div>
                            </label>
                        </div>

                        {responders.length > 1 && (
                            <button
                                type="button"
                                onClick={() => removeResponder(index)}
                                className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded transition-colors mb-0.5"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                ))}
            </div>

            <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={addResponder}
                        className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-blue-600 font-medium px-3 py-1.5 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add Another</span>
                    </button>

                    <span className="text-gray-300">|</span>

                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-green-600 font-medium px-3 py-1.5 hover:bg-green-50 rounded-lg transition-colors"
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
