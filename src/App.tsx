import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import { ToastContainer } from "react-toastify";

export default function App() {
    return (
        <div className="bg-red-500">
            <AuthProvider>
                <ToastProvider>
                    <RouterProvider router={router} />
                    <ToastContainer hideProgressBar={true}/>
                </ToastProvider>
            </AuthProvider>
        </div>
    );
}
