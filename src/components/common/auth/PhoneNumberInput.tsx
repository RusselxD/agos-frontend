import NumberOnlyInputField from "./NumberOnlyInputField";

interface PhoneNumberInputProps {
    phoneNumber: string;
    handleInputNumber: (input: string) => void;
    normalizedPhoneNumber: string;
}

export default function PhoneNumberInput({
    phoneNumber,
    handleInputNumber,
    normalizedPhoneNumber,
}: PhoneNumberInputProps) {
    return (
        <label className="flex flex-col relative">
            <span className="text-sm text-gray-700 mb-1 font-semibold">
                PHONE NUMBER
            </span>
            <div className="relative w-full">
                <span className="h-9 w-10 text-sm bg-gray-100 rounded-t-sm absolute bottom-0.5 left-0 flex items-center justify-center">
                    +63
                </span>
                <NumberOnlyInputField
                    value={phoneNumber}
                    setValue={handleInputNumber}
                />
            </div>
            {normalizedPhoneNumber && (
                <span className="text-sm mt-1 text-gray-500">{`Full number: ${normalizedPhoneNumber}`}</span>
            )}
        </label>
    );
}
