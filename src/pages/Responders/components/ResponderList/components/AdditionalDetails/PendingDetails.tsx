import { Clock } from "lucide-react";
import { formatDate } from "../../../../../../lib/utils/formatter";

export default function PendingDetails({
    submittedAt,
}: {
    submittedAt: string;
}) {
    return (
        <div className="rounded-xl border border-amber-300 dark:border-amber-500/30 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 p-3 text-sm shadow-sm transition-colors">
            <div className="flex items-start gap-3">
                <div className="rounded-full bg-orange-500 p-1.5 text-white">
                    <Clock className="h-5 w-5" />
                </div>
                <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                        <h3 className="font-semibold text-amber-900 dark:text-amber-100">
                            Pending Application
                        </h3>
                        <span className="rounded-full bg-amber-200 dark:bg-amber-900/40 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-amber-900 dark:text-amber-100 ring-1 ring-amber-300 dark:ring-amber-500/50">
                            Under Review
                        </span>
                    </div>
                    <p className="mt-1 text-[0.82rem] text-amber-800 dark:text-amber-200/80">
                        Submitted on{" "}
                        <span className="font-semibold dark:text-amber-100">
                            {formatDate(submittedAt)}
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}
