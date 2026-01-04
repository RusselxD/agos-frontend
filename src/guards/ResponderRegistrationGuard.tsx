import type { ReactNode } from "react";
import { useRespondersRegister } from "../pages/RespondersRegister/context/RespondersRegisterContext";
import { Navigate } from "react-router-dom";

interface ResponderRegistrationGuardProps {
    children: ReactNode;
    requireInitialData?: boolean;
    requireOTPVerified?: boolean;
    requireRegistrationCompleted?: boolean;
}

export default function ResponderRegistrationGuard({
    children,
    requireInitialData = false,
    requireOTPVerified = false,
    requireRegistrationCompleted = false,
}: ResponderRegistrationGuardProps) {

    const { initialDataIsFilled, otpIsVerified, registrationCompleted } =
        useRespondersRegister();

    if (requireInitialData && !initialDataIsFilled) {
        return <Navigate to="/responder/register" replace />;
    }

    if (requireOTPVerified && !otpIsVerified) {
        return <Navigate to="/responder/verify-otp" replace />;
    }

    if (requireRegistrationCompleted && !registrationCompleted) {
        return <Navigate to="/responder/upload-id-photo" replace />;
    }

    return <>{children}</>;
}
