import { CircleAlert } from "lucide-react";

export default function SelectionInfoBanner() {
    return (
        <div className="mb-4 flex items-start gap-3 rounded-xl border border-blue-200 dark:border-blue-500/30 bg-blue-50 dark:bg-blue-900/20 px-4 py-4 text-blue-700 dark:text-blue-300 transition-colors">
            <CircleAlert className="mt-0.5 h-5 w-5 shrink-0" />
            <p className="text-sm leading-7">
                Select individual responders below to send notifications. You can
                select multiple recipients and choose a template or write a
                custom message.
            </p>
        </div>
    );
}
