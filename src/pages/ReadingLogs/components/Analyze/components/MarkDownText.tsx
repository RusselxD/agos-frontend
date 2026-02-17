type Props = {
    text: string;
    showCursor?: boolean;
};

export default function MarkdownText({ text, showCursor = false }: Props) {
    const lines = text.split("\n");

    return (
        <div className="flex flex-col gap-1">
            {lines.map((line, i) => {
                // Empty line = small spacer
                if (!line.trim()) return <div key={i} className="h-2" />;

                const isBullet = line.trim().startsWith("- ");

                // Convert **bold** to <strong>
                const toHtml = (raw: string) =>
                    raw.replace(
                        /\*\*(.*?)\*\*/g,
                        (_, m) =>
                            `<strong class="font-semibold text-gray-900">${m}</strong>`,
                    );

                // Heading: lines like "**Some Title**" that are the entire line
                const isHeading =
                    /^\*\*(.+)\*\*$/.test(line.trim()) && !isBullet;
                if (isHeading) {
                    const html = toHtml(line.trim());
                    return (
                        <p
                            key={i}
                            className="text-sm font-semibold text-gray-900 mt-2"
                            dangerouslySetInnerHTML={{ __html: html }}
                        />
                    );
                }

                // Bullet point
                if (isBullet) {
                    const html = toHtml(line.replace(/^- /, ""));
                    return (
                        <div key={i} className="flex gap-2 items-start pl-1">
                            <span className="text-sky-500 mt-[7px] text-[6px] shrink-0">
                                ●
                            </span>
                            <span
                                className="text-sm text-gray-600 leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: html }}
                            />
                        </div>
                    );
                }

                // Regular paragraph
                const html = toHtml(line);
                return (
                    <p
                        key={i}
                        className="text-sm text-gray-600 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: html }}
                    />
                );
            })}

            {/* Blinking cursor while streaming */}
            {showCursor && (
                <span className="inline-block w-[2px] h-[14px] bg-sky-500 ml-[2px] align-middle animate-pulse" />
            )}
        </div>
    );
}
