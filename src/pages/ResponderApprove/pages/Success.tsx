import { CheckCircle } from "lucide-react";
import { useResponderApprove } from "../context/ResponderApproveContext";
import { formatPHNumber } from "../../../lib/utils/formatter";

export default function Success() {
    const { responder } = useResponderApprove();

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h1 className="mt-6 text-xl font-semibold text-gray-900">
                        Account Activated!
                    </h1>
                    <p className="mt-2 text-gray-600">
                        Your responder account for AGOS is now active. You will
                        receive SMS alerts when critical flood levels are
                        detected.
                    </p>
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-500">Registered as</p>
                        <p className="font-semibold text-gray-900">
                            {responder?.first_name} {responder?.last_name}
                        </p>
                        <p className="text-sm text-gray-600">
                            {formatPHNumber(responder?.phone_number ?? "")}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
