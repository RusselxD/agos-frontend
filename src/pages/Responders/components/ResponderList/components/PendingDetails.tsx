import { Clock } from "lucide-react";
import { formatDate } from "../../../../../lib/utils/formatter";

export default function PendingDetails({
    submittedAt,
}: {
    submittedAt: string;
}) {
    return (
        <div className="bg-amber-100 text-sm rounded-lg p-3">
            <div className="flex items-center gap-3 border-b border-orange-300 pb-3">
                <div className="text-white bg-orange-500 p-1.5 rounded-full">
                    <Clock className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="text-amber-900 font-semibold">
                        PENDING APPLICATION
                    </h3>
                    <p className="font-light text-orange-600">Under Review</p>
                </div>
            </div>
            <div className="flex items-center justify-between pt-2">
                <p className="text-[0.8rem] text-orange-700">Submitted:</p>
                <p className="font-medium text-orange-900">
                    {formatDate(submittedAt)}
                </p>
            </div>
        </div>
    );
}
