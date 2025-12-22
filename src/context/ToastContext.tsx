import { CheckCircle, XCircle } from "lucide-react";
import { createContext, useContext } from "react";
import { toast } from "react-toastify";

interface ToastContextValue {
    toastSuccess: (message: string) => void;
    toastError: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const toastSuccess = (message: string) => {
        toast(
            <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                    <CheckCircle
                        className="w-5 h-5 text-green-700"
                        strokeWidth={2}
                    />
                </div>
                <div className="flex-1">
                    <strong className="text-green-900 font-bold text-sm block mb-1">
                        Success!
                    </strong>
                    <p className="text-green-800 text-sm leading-relaxed">
                        {message}
                    </p>
                </div>
            </div>,
            {
                style: {
                    background: "rgb(220, 252, 231)", // green-100
                    border: "2px solid rgb(134, 239, 172)", // green-300
                    padding: "0.8rem 0.5rem",
                    borderRadius: "0.5rem",
                    boxShadow: "0 4px 6px -1px rgba(239, 68, 68, 0.1)",
                },
                icon: false,
            }
        );
    };

    const toastError = (message: string) => {
        toast(
            <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                    <XCircle className="w-5 h-5 text-red-700" strokeWidth={2} />
                </div>
                <div className="flex-1">
                    <strong className="text-red-900 font-bold text-sm block mb-1">
                        Error!
                    </strong>
                    <p className="text-red-800 text-sm leading-relaxed">
                        {message}
                    </p>
                </div>
            </div>,
            {
                style: {
                    background: "rgb(254, 226, 226)", // red-100
                    border: "2px solid rgb(252, 165, 165)", // red-300
                    padding: "0.8rem 0.5rem",
                    borderRadius: "0.5rem",
                    boxShadow: "0 4px 6px -1px rgba(239, 68, 68, 0.1)",
                },
                icon: false,
            }
        );
    };

    const contextValue = {
        toastSuccess,
        toastError,
    };

    return (
        <ToastContext.Provider value={contextValue}>
            {children}
        </ToastContext.Provider>
    );
}

export const useToast = () => {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
};
