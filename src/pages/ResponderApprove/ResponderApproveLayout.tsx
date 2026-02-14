import { useEffect, useState } from "react";
import { Outlet, useParams, useNavigate, useLocation } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import {
    useResponderApprove,
    ResponderApproveProvider,
} from "./context/ResponderApproveContext";
import { responderAPI } from "../../lib/api/responder";

function ResponderApproveLayoutInner() {
    const { uuid } = useParams<{ uuid: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const { setResponder, setUuid, responder } = useResponderApprove();

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        const loadResponder = async () => {
            if (!uuid) {
                setError("Invalid verification link.");
                setIsLoading(false);
                return;
            }

            // If we already have the responder data, don't refetch
            if (responder) {
                setIsLoading(false);
                return;
            }

            try {
                const data =
                    await responderAPI.getResponderDetailsForApproval(uuid);
                setResponder(data);
                setUuid(uuid);
                setIsLoading(false);

                // If responder is already active, redirect to success page
                if (
                    data.status === "active" &&
                    !location.pathname.includes("/success")
                ) {
                    navigate(`/responder/approve/${uuid}/success`, {
                        replace: true,
                    });
                }
            } catch {
                setError("This verification link is invalid or has expired.");
                setIsLoading(false);
            }
        };

        loadResponder();
    }, [uuid, setResponder, setUuid, responder]);

    // Redirect to base if trying to access verify/success without data
    useEffect(() => {
        if (!isLoading && responder && location.pathname.includes("/verify")) {
            // Allow access to verify page
        } else if (
            !isLoading &&
            responder &&
            location.pathname.includes("/success")
        ) {
            // Allow access to success page
        }
    }, [isLoading, responder, location, navigate]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                        <div className="spinner w-10 h-10 mx-auto border-primary border-t-transparent"></div>
                        <p className="mt-4 text-gray-600">
                            Loading verification...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                            <AlertCircle className="w-8 h-8 text-red-600" />
                        </div>
                        <h1 className="mt-6 text-xl font-semibold text-gray-900">
                            Verification Failed
                        </h1>
                        <p className="mt-2 text-gray-600">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return <Outlet />;
}

export default function ResponderApproveLayout() {
    return (
        <ResponderApproveProvider>
            <ResponderApproveLayoutInner />
        </ResponderApproveProvider>
    );
}
