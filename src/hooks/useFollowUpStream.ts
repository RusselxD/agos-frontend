// hooks/useFollowUpStream.ts
import { useState, useRef } from "react";

type Message = { role: "user" | "assistant"; content: string };

export function useFollowUpStream(summaries: object[]) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [streamingText, setStreamingText] = useState("");
    const [isStreaming, setIsStreaming] = useState(false);
    const abortRef = useRef<AbortController | null>(null);

    const sendMessage = async (question: string) => {
        if (isStreaming) return;

        // Optimistically add the user message
        const userMessage: Message = { role: "user", content: question };
        const updatedHistory = [...messages, userMessage];
        setMessages(updatedHistory);
        setStreamingText("");
        setIsStreaming(true);

        abortRef.current?.abort();
        abortRef.current = new AbortController();

        try {
            const res = await fetch("/api/analysis/follow-up", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
                body: JSON.stringify({
                    question,
                    summaries,
                    // send prior turns as history (exclude the message we just added)
                    history: messages.map((m) => ({
                        role: m.role,
                        content: m.content,
                    })),
                }),
                signal: abortRef.current.signal,
            });

            if (!res.ok) throw new Error("Follow-up request failed");

            const reader = res.body!.getReader();
            const decoder = new TextDecoder();
            let fullResponse = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const lines = decoder
                    .decode(value)
                    .split("\n")
                    .filter((l) => l.startsWith("data: "));

                for (const line of lines) {
                    const parsed = JSON.parse(
                        line.replace("data: ", "").trim(),
                    );

                    if (parsed.done) {
                        // Commit the full streamed reply to message history
                        setMessages((prev) => [
                            ...prev,
                            { role: "assistant", content: fullResponse },
                        ]);
                        setStreamingText("");
                        setIsStreaming(false);
                        return;
                    }

                    if (parsed.text) {
                        fullResponse += parsed.text;
                        setStreamingText(fullResponse);
                    }
                }
            }
        } catch (err: any) {
            if (err.name !== "AbortError") setIsStreaming(false);
        }
    };

    return { messages, streamingText, isStreaming, sendMessage };
}
