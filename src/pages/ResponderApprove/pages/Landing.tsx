import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Send } from "lucide-react";
import { useResponderApprove } from "../context/ResponderApproveContext";
import { formatPHNumber } from "../../../lib/utils/formatter";
import { responderAPI } from "../../../lib/api/responder";

export default function Landing() {
    const { responder, uuid } = useResponderApprove();
    const navigate = useNavigate();

    const [isSendingOtp, setIsSendingOtp] = useState(false);

    // Redirect to success if already active
    useEffect(() => {
        if (responder?.status === "active") {
            navigate(`/responder/approve/${uuid}/success`, { replace: true });
        }
    }, [responder, uuid, navigate]);

    const handleSendOtp = async () => {
        setIsSendingOtp(true);

        try {
            await responderAPI.sendVerificationOTP(uuid!);
            navigate(`/responder/approve/${uuid}/verify`);
        } catch (error) {
            // Handle error
        } finally {
            setIsSendingOtp(false);
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
                            AGOS Responder Verification
                        </h1>
                        <p className="mt-2 text-gray-600 text-sm">
                            Your phone number has been registered to receive SMS
                            alerts from the AGOS Flood Monitoring System.
                        </p>
                    </div>

                    {/* Responder Info */}
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg text-center">
                        <p className="text-sm text-gray-500">Registered as</p>
                        <p className="font-semibold text-gray-900">
                            {responder?.first_name} {responder?.last_name}
                        </p>
                        <p className="text-sm text-gray-600">
                            {formatPHNumber(responder?.phone_number ?? "")}
                        </p>
                    </div>

                    {/* Verify Button */}
                    <button
                        onClick={handleSendOtp}
                        disabled={isSendingOtp}
                        className="mt-8 w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSendingOtp ? (
                            <>
                                <div className="spinner w-5 h-5 border-white border-t-transparent"></div>
                                <span>Sending code...</span>
                            </>
                        ) : (
                            <>
                                <Send className="w-5 h-5" />
                                <span>Verify my Phone Number</span>
                            </>
                        )}
                    </button>

                    {/* Footer */}
                    <p className="mt-6 text-center text-xs text-gray-500">
                        A 6-digit verification code will be sent to your phone
                        number.
                    </p>
                </div>
            </div>
        </div>
    );
}
