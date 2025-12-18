import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

const normalizePhoneNumber = (input: string): string => {
    // Remove all non-digits
    const digitsOnly = input.replace(/\D/g, "");

    // Handle different input formats
    if (digitsOnly.startsWith("63") && digitsOnly.length === 12) {
        // +639207134335 or 639207134335 -> +639207134335
        return `+${digitsOnly}`;
    } else if (digitsOnly.startsWith("0") && digitsOnly.length === 11) {
        // 09207134335 -> +639207134335
        return `+63${digitsOnly.substring(1)}`;
    } else if (digitsOnly.length > 0) {
        // Any other digits -> +63{digits}
        // 9207134335 -> +639207134335
        // 123 -> +63123
        return `+63${digitsOnly}`;
    } else {
        // Empty input
        return "";
    }
};

const RegisterAsResponder = () => {
    return (
        <p className="w-full text-center text-sm -mt-5 font-semibold">
            <span>REGISTER AS </span>
            <NavLink to="/" className="text-accent">
                RESPONDER
            </NavLink>
        </p>
    );
};

interface PhoneNumberInputProps {
    phoneNumber: string;
    handleInputNumber: (e: React.ChangeEvent<HTMLInputElement>) => void;
    normalizedPhoneNumber: string;
}

const PhoneNumberInput = ({
    phoneNumber,
    handleInputNumber,
    normalizedPhoneNumber,
}: PhoneNumberInputProps) => {
    return (
        <label className="flex flex-col relative">
            <span className="text-sm text-gray-700 mb-1 font-semibold">
                PHONE NUMBER
            </span>
            <div className="relative w-full">
                <span className="h-10 bg-gray-100 w-12 rounded-t-sm absolute bottom-0.5 left-0 flex items-center justify-center">
                    +63
                </span>
                <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => handleInputNumber(e)}
                    placeholder="9123456789"
                    className="custom-input w-full pl-14"
                    onKeyDown={(e) => {
                        // Only allow numbers, backspace, delete, arrow keys, tab
                        const allowedKeys = [
                            "Backspace",
                            "Delete",
                            "ArrowLeft",
                            "ArrowRight",
                            "Tab",
                        ];

                        if (
                            !allowedKeys.includes(e.key) &&
                            !/[0-9]/.test(e.key)
                        ) {
                            e.preventDefault();
                        }
                    }}
                    onPaste={(e) => {
                        // Handle paste - only allow digits
                        const pastedText = e.clipboardData.getData("text");
                        if (!/^\d+$/.test(pastedText)) {
                            e.preventDefault();
                        }
                    }}
                    inputMode="numeric" // Shows numeric keyboard on mobile
                    pattern="[0-9]*" // iOS numeric keyboard
                />
            </div>
            {normalizedPhoneNumber && (
                <span className="text-sm mt-1 text-gray-500">{`Full number: ${normalizedPhoneNumber}`}</span>
            )}
        </label>
    );
};

interface PasswordInputProps {
    password: string;
    setPassword: React.Dispatch<React.SetStateAction<string>>;
}

const PasswordInput = ({ password, setPassword }: PasswordInputProps) => {
    return (
        <label className="flex flex-col">
            <span className="text-sm text-gray-700 font-semibold">
                PASSWORD
            </span>
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="custom-input"
            />
        </label>
    );
};

export default function LoginForm() {
    const [phoneNumber, setPhoneNumber] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const [normalizedPhoneNumber, setNormalizedPhoneNumber] =
        useState<string>("");

    const handleInputNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value;
        // Remove all non-digits
        const digitsOnly = input.replace(/\D/g, "");

        // Determine max length based on what user is typing
        let maxLength;

        if (digitsOnly.startsWith("63")) {
            maxLength = 12; // 639XXXXXXXXX (12 digits)
        } else if (digitsOnly.startsWith("0")) {
            maxLength = 11; // 09XXXXXXXXX (11 digits)
        } else if (digitsOnly.startsWith("9")) {
            maxLength = 10; // 9XXXXXXXXX (10 digits)
        } else {
            maxLength = 10; // Default to longest possible
        }

        // Only update if within limit
        if (digitsOnly.length <= maxLength) {
            setPhoneNumber(digitsOnly);
            setNormalizedPhoneNumber(normalizePhoneNumber(input));
        }
    };

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await login(normalizedPhoneNumber, password);
            console.log("Logged In! Redirecting now....");
            navigate("/admin");
        } catch (error) {
            console.log(error);
        } finally {
        }
    };

    return (
        <form
            onSubmit={(e) => handleSubmit(e)}
            className=" w-full flex flex-col gap-10"
        >
            <PhoneNumberInput
                phoneNumber={phoneNumber}
                handleInputNumber={handleInputNumber}
                normalizedPhoneNumber={normalizedPhoneNumber}
            />
            <PasswordInput password={password} setPassword={setPassword} />

            <button
                disabled={normalizedPhoneNumber.length < 12 || !password}
                type="submit"
                className="bg-accent rounded-xl hover:bg-accent/90 transition-colors py-3 px-8 text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-accent"
            >
                Login
            </button>
            <RegisterAsResponder />
        </form>
    );
}
