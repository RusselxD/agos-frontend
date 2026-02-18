import { UserRound } from "lucide-react";

export default function UserBubble({ text }: { text: string }) {
    return (
        <div className="flex gap-1.5 items-start justify-end">
            <div className="max-w-[85%] bg-slate-900 text-white rounded-xl rounded-tr-sm px-4 py-3 shadow-sm">
                <p className="text-sm whitespace-pre-wrap">{text}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                <UserRound className="w-4 h-4 text-slate-600" />
            </div>
        </div>
    );
}
