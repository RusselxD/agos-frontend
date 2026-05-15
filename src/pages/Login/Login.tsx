import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LayoutDashboard } from "lucide-react";
import AuthFormContainer from "../../components/common/auth/AuthFormContainer";
import { useAuth } from "../../context/AuthContext";
import LoginForm from "./components/LoginForm";

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
            <Link
                to="/public"
                className="flex items-center gap-1.5 text-sm text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 transition-colors"
            >
                <LayoutDashboard className="w-4 h-4" />
                <span>Public Dashboard</span>
            </Link>
        </AuthFormContainer>
    );
}
