import { Trash2 } from "lucide-react";
import TextInputField from "../../../../../../components/common/auth/TextInputField";
import PhoneNumberInput from "../../../../../../components/common/auth/PhoneNumberInput";
import type { Dispatch, SetStateAction } from "react";

interface ResponderEntryRowProps {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    normalizedPhoneNumber: string;
    setFirstName: Dispatch<SetStateAction<string>>;
    setLastName: Dispatch<SetStateAction<string>>;
    handlePhoneNumberChange: (input: string) => void;
    onRemove: () => void;
    canRemove: boolean;
}

export default function ResponderEntryRow({
    firstName,
    lastName,
    phoneNumber,
    normalizedPhoneNumber,
    setFirstName,
    setLastName,
    handlePhoneNumberChange,
    onRemove,
    canRemove,
}: ResponderEntryRowProps) {
    return (
        <div className="space-y-3 rounded-lg border border-gray-100 bg-white p-3">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div className="w-full sm:w-1/2">
                    <PhoneNumberInput
                        phoneNumber={phoneNumber}
                        handleInputNumber={handlePhoneNumberChange}
                        normalizedPhoneNumber={normalizedPhoneNumber}
                    />
                </div>

                {canRemove && (
                    <button
                        type="button"
                        onClick={onRemove}
                        className="self-end rounded p-2 text-red-500 transition-colors hover:bg-red-50 hover:text-red-700"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                )}
            </div>
        </div>
    );
}
