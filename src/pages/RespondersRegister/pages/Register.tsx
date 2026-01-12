import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import AuthFormContainer from "../../../components/common/auth/AuthFormContainer";
import PhoneNumberInput from "../../../components/common/auth/PhoneNumberInput";
import { useRespondersRegister } from "../context/RespondersRegisterContext";
import { normalizeNumberInput } from "../../../lib/utils/formatter";
import TextInputField from "../../../components/common/auth/TextInputField";
import { responderAPI } from "../../../lib/api/responder";
import type {
    ResponderOTPRequest,
    ResponderOTPResponse,
} from "../../../types/responder";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RegisterForm = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");

    const { initialDataIsFilled, setInitialDataIsFilled } =
        useRespondersRegister();
    const navigate = useNavigate();

    const [phoneNumber, setPhoneNumber] = useState<string>("");
    const {
        normalizedPhoneNumber,
        setNormalizedPhoneNumber,
        firstName,
        setFirstName,
        lastName,
        setLastName,
    } = useRespondersRegister();

    const handleInputNumber = (input: string) => {
        normalizeNumberInput(input, setPhoneNumber, setNormalizedPhoneNumber);
    };

    // If initial data is already filled, navigate to OTP verification
    useEffect(() => {
        if (initialDataIsFilled) {
            navigate("/responder/verify-otp");
        }
    }, [initialDataIsFilled, navigate]);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Remove focus from any input fields
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }

        try {
            setIsLoading(true);

            await new Promise((resolve) => setTimeout(resolve, 2000));
            const response: ResponderOTPResponse = await responderAPI.sendOTP({
                phone_number: normalizedPhoneNumber,
            } as ResponderOTPRequest);

            // On successful OTP send, modify the flag variable and it will automatically navigate (via useEffect above)
            if (response.success) {
                setInitialDataIsFilled(true);
                return;
            }

            setErrorMessage(
                response.message || "Failed to send OTP. Please try again."
            );
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setErrorMessage(
                    error.message || "Failed to send OTP. Please try again."
                );
            } else {
                setErrorMessage("An unexpected error occurred.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form
            className="w-full flex flex-col gap-8"
            onSubmit={(e) => handleSubmit(e)}
        >
            {errorMessage && (
                <div className="border border-red-500 bg-red-100 px-3 py-2 rounded-md text-sm text-red-800">
                    {errorMessage}
                </div>
            )}

            <div className="flex flex-col gap-8 md:flex-row md:gap-3">
                <TextInputField
                    value={firstName}
                    setValue={setFirstName}
                    label="FIRST NAME"
                    placeholder="Enter your first name"
                />
                <TextInputField
                    value={lastName}
                    setValue={setLastName}
                    label="LAST NAME"
                    placeholder="Enter your last name"
                />
            </div>

            <PhoneNumberInput
                phoneNumber={phoneNumber}
                handleInputNumber={handleInputNumber}
                normalizedPhoneNumber={normalizedPhoneNumber}
            />
            <button
                disabled={
                    normalizedPhoneNumber.length <= 12 ||
                    !firstName ||
                    !lastName ||
                    isLoading
                }
                type="submit"
                className="bg-primary flex items-center justify-center gap-5 rounded-xl hover:bg-primary/90 transition-colors py-3 px-8 text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary"
            >
                {isLoading && <div className="spinner w-5 h-5"></div>}
                <span>SEND OTP</span>
            </button>
        </form>
    );
};

export default function Register() {
    return (
        <AuthFormContainer
            title="REGISTER"
            subtitle="FILL OUT THE FORM TO REGISTER AS A RESPONDER"
        >
            <RegisterForm />
        </AuthFormContainer>
    );
}
