import AuthFormContainer from "../../components/common/auth/AuthFormContainer";
import LoginForm from "./components/LoginForm";

export default function Login() {
    return (
        <AuthFormContainer
            title="LOGIN"
            subtitle="PLEASE LOGIN TO YOUR ACCOUNT TO CONTINUE"
        >
            <LoginForm />
        </AuthFormContainer>
    );
}
