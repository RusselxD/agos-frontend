import { useEffect, useRef, useState } from "react";
import { responderAPI } from "../../../lib/api/responder";
import type {
    ResponderOTPRequest,
    ResponderOTPResponse,
    ResponderOTPVerifyRequest,
    ResponderOTPVerifyResponse,
} from "../../../types/responder";
import InputOTPField from "./InputOTPField";
import { useToast } from "../../../context/ToastContext";
import { useNavigate } from "react-router-dom";
import { useRespondersRegister } from "../context/RespondersRegisterContext";

const OTP_LENGTH = 6;

export default function VerifyOTPForm({
    phoneNumber,
}: {
    phoneNumber: string;
}) {
    const [isVerifying, setIsVerifying] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");

    const [shouldResend, setShouldResend] = useState<boolean>(false);
    const [isResending, setIsResending] = useState<boolean>(false);

    const [otp, setOtp] = useState<string[]>(new Array(OTP_LENGTH).fill(""));
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const { toastError, toastSuccess } = useToast();
    const navigate = useNavigate();
    const { otpIsVerified, setOtpIsVerified } = useRespondersRegister();

    // If OTP is already verified, navigate to next step
    useEffect(() => {
        if (otpIsVerified) {
            navigate("/responder/upload-id-photo");
        }
    }, [otpIsVerified, navigate]);

    const handleVerify = async (code: string) => {
        if (code.length !== 6 || isVerifying || isResending || shouldResend)
            return;
        try {
            setIsVerifying(true);
            await new Promise((resolve) => setTimeout(resolve, 2000));

            const response: ResponderOTPVerifyResponse =
                await responderAPI.verifyOTP({
                    phone_number: phoneNumber,
                    otp: code,
                } as ResponderOTPVerifyRequest);

            // On successful verification, modify the flag variable and it will automatically navigate (via useEffect above)
            if (response.success) {
                setOtpIsVerified(true);
                return;
            }

            // reset OTP inputs
            setOtp(new Array(OTP_LENGTH).fill(""));
            inputRefs.current[0]?.focus();

            setErrorMessage(
                response.message || "Verification failed. Please try again."
            );
            setShouldResend(response.send_again);
        } catch (error) {
            console.log(error);
            setErrorMessage(
                "Verification failed. Please check the OTP and try again."
            );
            setOtp(new Array(OTP_LENGTH).fill(""));
            inputRefs.current[0]?.focus();
        } finally {
            setIsVerifying(false);
        }
    };

    const handleResend = async () => {
        if (isResending) return;

        try {
            setIsResending(true);

            const response: ResponderOTPResponse = await responderAPI.sendOTP({
                phone_number: phoneNumber,
            } as ResponderOTPRequest);

            if (response.success) {
                setShouldResend(false);
                setErrorMessage("");
                toastSuccess("OTP resent successfully.");
            } else {
                toastError(
                    response.message ||
                        "Failed to resend OTP. Please try again."
                );
            }
        } catch (error) {
            toastError("Failed to resend OTP. Please try again.");
        } finally {
            setIsResending(false);
        }
    };

    return (
        <form
            className="w-full flex flex-col gap-3"
            onSubmit={(e) => {
                e.preventDefault();
                handleVerify(otp.join(""));
            }}
        >
            <InputOTPField
                shouldResend={shouldResend}
                isLoading={isVerifying}
                errorMessage={errorMessage}
                otp={otp}
                setOtp={setOtp}
                setErrorMessage={setErrorMessage}
                handleVerify={handleVerify}
                inputRefs={inputRefs}
            />

            {/* Should only show when not allowed to resend yet */}
            {!shouldResend && (
                <p className="text-sm w-full text-center flex items-center justify-center">
                    <span className="text-gray-500">
                        Didn't receive the OTP?
                    </span>
                    <button
                        className={`text-primary p-2 ${
                            isResending
                                ? "cursor-default font-medium"
                                : "font-bold cursor-pointer"
                        }`}
                        onClick={() => handleResend()}
                    >
                        Resend
                    </button>
                    {isResending && <div className="spinner w-4 h-4"></div>}
                </p>
            )}

            {errorMessage && (
                <div className="border border-red-500 bg-red-100 p-4 rounded-md text-sm gap-2 flex flex-col">
                    <p className="text-red-800">{errorMessage}</p>

                    {/* Show request OTP button if allowed to resend */}
                    {shouldResend && (
                        <button
                            disabled={isResending}
                            onClick={() => handleResend()}
                            className="btn-submit w-fit rounded-md px-5"
                        >
                            {isVerifying && (
                                <div className="spinner w-5 h-5"></div>
                            )}
                            <span>Request new OTP</span>
                        </button>
                    )}
                </div>
            )}
            <button
                disabled={
                    otp.join("").length < 6 || isVerifying || shouldResend
                }
                type="submit"
                className="btn-submit"
            >
                {isVerifying && <div className="spinner w-5 h-5"></div>}
                <span>VERIFY</span>
            </button>
        </form>
    );
}
