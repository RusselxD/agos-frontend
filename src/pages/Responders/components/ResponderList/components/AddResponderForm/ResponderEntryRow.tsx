import { Trash2 } from "lucide-react";
import TextInputField from "../../../../../../components/common/auth/TextInputField";
import PhoneNumberInput from "../../../../../../components/common/auth/PhoneNumberInput";
import type { Dispatch, SetStateAction } from "react";
import { isValidPHMobileNumber } from "../../../../../../lib/utils/formatter";

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
    const hasCompleteInvalidPhoneNumber =
        normalizedPhoneNumber.length >= 13 &&
        !isValidPHMobileNumber(normalizedPhoneNumber);

    return (
        <div className="bg-white dark:bg-slate-700/30 p-3 rounded-lg border border-gray-100 dark:border-slate-600 space-y-3 transition-colors">
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
                    {hasCompleteInvalidPhoneNumber && (
                        <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                            Enter a valid Philippine mobile number beginning with
                            9.
                        </p>
                    )}
                </div>

                {canRemove && (
                    <button
                        type="button"
                        onClick={onRemove}
                        className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                )}
            </div>
        </div>
    );
}
