import type { ReactNode } from "react";

type Props = {
    text: string;
    showCursor?: boolean;
};

function renderInline(text: string): ReactNode[] {
    const parts = text.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, idx) =>
        idx % 2 === 1 ? (
            <strong key={idx} className="font-semibold text-gray-900 dark:text-slate-200 transition-colors">{part}</strong>
        ) : (
            <span key={idx}>{part}</span>
        )
    );
}

export default function MarkdownText({ text, showCursor = false }: Props) {
    const lines = text.split("\n");

    return (
        <div className="flex flex-col gap-1">
            {lines.map((line, i) => {
                // Empty line = small spacer
                if (!line.trim()) return <div key={i} className="h-2" />;

                const isBullet = line.trim().startsWith("- ");

                // Heading: lines like "**Some Title**" that are the entire line
                const isHeading =
                    /^\*\*(.+)\*\*$/.test(line.trim()) && !isBullet;
                if (isHeading) {
                    return (
                        <p
                            key={i}
                            className="text-sm font-semibold text-gray-900 dark:text-slate-200 mt-2 transition-colors"
                        >
                            {renderInline(line.trim())}
                        </p>
                    );
                }

                // Bullet point
                if (isBullet) {
                    return (
                        <div key={i} className="flex gap-2 items-start pl-1">
                            <span className="text-sky-500 mt-[7px] text-[6px] shrink-0">
                                ●
                            </span>
                            <span className="text-sm text-gray-600 dark:text-slate-300 leading-relaxed transition-colors">
                                {renderInline(line.replace(/^- /, ""))}
                            </span>
                        </div>
                    );
                }

                // Regular paragraph
                return (
                    <p
                        key={i}
                        className="text-sm text-gray-600 dark:text-slate-300 leading-relaxed transition-colors"
                    >
                        {renderInline(line)}
                    </p>
                );
            })}

            {/* Blinking cursor while streaming */}
            {showCursor && (
                <span className="inline-block w-[2px] h-[14px] bg-sky-500 ml-[2px] align-middle animate-pulse" />
            )}
        </div>
    );
}
