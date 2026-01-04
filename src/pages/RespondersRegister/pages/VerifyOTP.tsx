import AuthFormContainer from "../../../components/common/auth/AuthFormContainer";
import VerifyOTPForm from "../components/VerifyOTPForm";
import { useRespondersRegister } from "../context/RespondersRegisterContext";

export default function VerifyOTP() {
    const { normalizedPhoneNumber } = useRespondersRegister();

    return (
        <AuthFormContainer
            title="VERIFY YOUR PHONE"
            subtitle={`ENTER THE OTP SENT TO ${normalizedPhoneNumber}`}
        >
            <VerifyOTPForm phoneNumber={normalizedPhoneNumber} />
        </AuthFormContainer>
    );
}
