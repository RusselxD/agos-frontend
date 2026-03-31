import { useEffect } from "react";
import AuthFormContainer from "../../components/common/auth/AuthFormContainer";
import { useAuth } from "../../context/AuthContext";
import LoginForm from "./components/LoginForm";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/admin");
        }
    }, [isAuthenticated, navigate]);

    return (
        <AuthFormContainer
            title="LOGIN"
            subtitle="PLEASE LOGIN TO YOUR ACCOUNT TO CONTINUE"
        >
            <LoginForm />
        </AuthFormContainer>
    );
}
