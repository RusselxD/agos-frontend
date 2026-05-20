import { useState } from "react";
import { Save, X } from "lucide-react";
import axios from "axios";
import type { ResponderAllDetails } from "../../../../../../types/responder";
import { responderAPI } from "../../../../../../lib/api/responder";
import { useResponders } from "../../../../context/RespondersPageContext";
import { useResponderList } from "../../context/ResponderListContext";
import { useToast } from "../../../../../../context/ToastContext";
import { normalizeNumberInput } from "../../../../../../lib/utils/formatter";
import TextInputField from "../../../../../../components/common/auth/TextInputField";
import PhoneNumberInput from "../../../../../../components/common/auth/PhoneNumberInput";

interface Props {
    responder: ResponderAllDetails;
    onCancel: () => void;
    onSaved: () => void;
}

export default function EditResponderForm({
    responder,
    onCancel,
    onSaved,
}: Props) {
    const initialLocal = responder.phone_number.replace(/^\+63/, "");
    const [firstName, setFirstName] = useState(responder.first_name);
    const [lastName, setLastName] = useState(responder.last_name);
    const [phoneNumber, setPhoneNumber] = useState(initialLocal);
    const [normalizedPhoneNumber, setNormalizedPhoneNumber] = useState(
        responder.phone_number,
    );
    const [isSaving, setIsSaving] = useState(false);
    const [phoneError, setPhoneError] = useState<string | null>(null);

    const { setCache } = useResponders();
    const { addResponderToCache } = useResponderList();
    const { toastSuccess, toastError } = useToast();

    const handlePhoneInput = (input: string) => {
        setPhoneError(null);
        normalizeNumberInput(
            input,
            (v) => setPhoneNumber(v as string),
            (v) => setNormalizedPhoneNumber(v as string),
        );
    };

    const trimmedFirst = firstName.trim();
    const trimmedLast = lastName.trim();
    const phoneLooksValid = normalizedPhoneNumber.length >= 13;
    const hasChanges =
        trimmedFirst !== responder.first_name ||
        trimmedLast !== responder.last_name ||
        normalizedPhoneNumber !== responder.phone_number;
    const isFormValid =
        !!trimmedFirst && !!trimmedLast && phoneLooksValid && hasChanges;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!isFormValid || isSaving) return;

        const payload: {
            first_name?: string;
            last_name?: string;
            phone_number?: string;
        } = {};
        if (trimmedFirst !== responder.first_name)
            payload.first_name = trimmedFirst;
        if (trimmedLast !== responder.last_name)
            payload.last_name = trimmedLast;
        if (normalizedPhoneNumber !== responder.phone_number)
            payload.phone_number = normalizedPhoneNumber;

        setIsSaving(true);
        setPhoneError(null);
        try {
            const updated = await responderAPI.updateResponder(
                responder.id,
                payload,
            );

            setCache((prev) => ({
                ...prev,
                responders: (prev.responders ?? []).map((r) =>
                    r.id === updated.id ? { ...r, ...updated } : r,
                ),
            }));
            addResponderToCache({
                ...responder,
                ...updated,
            });

            toastSuccess("Responder details updated.");
            onSaved();
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 409) {
                setPhoneError("Phone number already in use.");
            } else {
                toastError("Failed to update responder. Please try again.");
            }
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="rounded-xl border border-gray-200 dark:border-slate-700/50 bg-white dark:bg-slate-800 p-3 shadow-sm space-y-3">
                <TextInputField
                    value={firstName}
                    setValue={setFirstName}
                    label="FIRST NAME"
                    placeholder="Enter first name"
                />
                <TextInputField
                    value={lastName}
                    setValue={setLastName}
                    label="LAST NAME"
                    placeholder="Enter last name"
                />
                <div>
                    <PhoneNumberInput
                        phoneNumber={phoneNumber}
                        handleInputNumber={handlePhoneInput}
                        normalizedPhoneNumber={normalizedPhoneNumber}
                    />
                    {phoneError && (
                        <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                            {phoneError}
                        </p>
                    )}
                </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={isSaving}
                    className="btn-cancel text-sm py-2 flex items-center gap-1.5"
                >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                </button>
                <button
                    type="submit"
                    disabled={!isFormValid || isSaving}
                    className="btn-custom bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm py-2 disabled:hover:bg-blue-600 flex items-center gap-1.5"
                >
                    {isSaving ? (
                        <div className="spinner w-4 h-4" />
                    ) : (
                        <Save className="w-4 h-4" />
                    )}
                    <span>Save</span>
                </button>
            </div>
        </form>
    );
}
