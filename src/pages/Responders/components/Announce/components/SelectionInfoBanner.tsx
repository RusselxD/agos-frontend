import { CircleAlert } from "lucide-react";

export default function SelectionInfoBanner() {
    return (
        <div className="mb-4 flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-4 text-blue-700">
            <CircleAlert className="mt-0.5 h-5 w-5 shrink-0" />
            <p className="text-sm leading-7">
                Select individual responders below to send notifications. You can
                select multiple recipients and choose a template or write a
                custom message.
            </p>
        </div>
    );
}
