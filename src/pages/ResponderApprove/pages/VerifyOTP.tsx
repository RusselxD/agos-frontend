import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield } from "lucide-react";
import { useResponderApprove } from "../context/ResponderApproveContext";
import { formatPHNumber } from "../../../lib/utils/formatter";
import InputOTPField from "../components/InputOTPField";
import { responderAPI } from "../../../lib/api/responder";

export default function VerifyOTP() {
    const { responder, uuid } = useResponderApprove();
    const navigate = useNavigate();

    const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
    const [otpError, setOtpError] = useState<string>("");
    const [isVerifying, setIsVerifying] = useState(false);
    const [requiresResend, setRequiresResend] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [resendSuccess, setResendSuccess] = useState(false);

    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const handleVerify = async (_code: string) => {
        setIsVerifying(true);
        setOtpError("");
        setRequiresResend(false);

        try {
            const res = await responderAPI.verifyOTP({
                responder_id: uuid!,
                otp: _code,
            });

            if (res.success) {
                navigate(`/responder/approve/${uuid}/success`);
            } else {
                setOtpError(
                    res.message || "Verification failed. Please try again.",
                );
                setRequiresResend(res.requires_resend);
                setOtp(new Array(6).fill(""));
                inputRefs.current?.[0]?.focus();
            }
        } catch {
            setOtpError("Something went wrong. Please try again.");
            setOtp(new Array(6).fill(""));
            inputRefs.current?.[0]?.focus();
        } finally {
            setIsVerifying(false);
        }
    };

    const handleResendOTP = async () => {
        setIsResending(true);
        setOtpError("");
        setResendSuccess(false);

        try {
            await responderAPI.sendVerificationOTP(uuid!);
            setResendSuccess(true);
            setRequiresResend(false);
            setOtp(new Array(6).fill(""));
            inputRefs.current?.[0]?.focus();
        } catch {
            setOtpError("Failed to resend code. Please try again.");
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-xl shadow-lg p-8">
                    {/* Header */}
                    <div className="text-center">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                            <Shield className="w-8 h-8 text-primary" />
                        </div>
                        <h1 className="mt-6 text-xl font-semibold text-gray-900">
                            Enter Verification Code
                        </h1>
                        <p className="mt-2 text-gray-600 text-sm">
                            We sent a 6-digit code to your phone number. Enter
                            it below to verify your account.
                        </p>
                    </div>

                    {/* Responder Info */}
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg text-center">
                        <p className="font-semibold text-gray-900">
                            {responder?.first_name} {responder?.last_name}
                        </p>
                        <p className="text-sm text-gray-600">
                            {formatPHNumber(responder?.phone_number ?? "")}
                        </p>
                    </div>

                    {/* OTP Section */}
                    <div className="mt-8">
                        <InputOTPField
                            isLoading={isVerifying}
                            otp={otp}
                            setOtp={setOtp}
                            setErrorMessage={setOtpError}
                            handleVerify={handleVerify}
                            inputRefs={inputRefs}
                        />

                        {otpError && (
                            <p className="mt-3 text-center text-sm text-red-600">
                                {otpError}
                            </p>
                        )}

                        {resendSuccess && (
                            <p className="mt-3 text-center text-sm text-green-600">
                                A new verification code has been sent.
                            </p>
                        )}

                        {isVerifying && (
                            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-600">
                                <div className="spinner w-4 h-4 border-primary border-t-transparent"></div>
                                <span>Verifying...</span>
                            </div>
                        )}

                        {/* Resend OTP */}
                        <div className="mt-4 text-center">
                            {requiresResend ? (
                                <button
                                    onClick={handleResendOTP}
                                    disabled={isResending}
                                    className="text-sm font-medium text-primary hover:text-primary/80 disabled:opacity-50"
                                >
                                    {isResending
                                        ? "Sending..."
                                        : "Send new code"}
                                </button>
                            ) : (
                                <p className="text-sm text-gray-500">
                                    Didn't receive the code?{" "}
                                    <button
                                        onClick={handleResendOTP}
                                        disabled={isResending}
                                        className="font-medium text-primary hover:text-primary/80 disabled:opacity-50"
                                    >
                                        {isResending ? "Sending..." : "Resend"}
                                    </button>
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <p className="mt-8 text-center text-xs text-gray-500">
                        By verifying, you agree to receive emergency SMS alerts
                        from AGOS Flood Monitoring System.
                    </p>
                </div>
            </div>
        </div>
    );
}
