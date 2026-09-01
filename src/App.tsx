import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import { ThemeProvider } from "./context/ThemeContext";
import { ToastContainer } from "react-toastify";
import { startPwaUpdateLifecycle } from "./lib/pwa/updateLifecycle";

export default function App() {
    useEffect(() => startPwaUpdateLifecycle(router), []);

    return (
        <ThemeProvider>
            <AuthProvider>
                <ToastProvider>
                    <RouterProvider router={router} />
                    <ToastContainer hideProgressBar={true} />
                </ToastProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}
