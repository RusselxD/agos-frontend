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
        <div className="bg-white p-3 rounded-lg border border-gray-100 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

            <div className="flex items-end justify-between gap-3">
                <div className="w-1/2">
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
                        className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                )}
            </div>
        </div>
    );
}
