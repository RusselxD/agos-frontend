import { Sparkles } from "lucide-react";
import MarkdownText from "./MarkDownText";

export default function AIBubble({
    text,
    showCursor = false,
}: {
    text: string;
    showCursor?: boolean;
}) {
    return (
        <div className="flex gap-1.5 items-start mb-4">
            <div className="gemini-btn cursor-default p-2">
                <Sparkles className="w-4 h-4" />
            </div>
            <div className="flex-1 bg-white border border-slate-200 rounded-xl rounded-tl-sm px-4 py-3 shadow-sm">
                <MarkdownText text={text} showCursor={showCursor} />
            </div>
        </div>
    );
}
