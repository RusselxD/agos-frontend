import AuthFormContainer from "../../components/common/auth/AuthFormContainer";
import ResetPasswordForm from "./components/ResetPasswordForm";

export default function ForcePasswordChange() {
    return (
        <AuthFormContainer
            title="RESET PASSWORD"
            subtitle="PLEASE SET A NEW PASSWORD TO CONTINUE"
        >
            <ResetPasswordForm />
        </AuthFormContainer>
    );
}
