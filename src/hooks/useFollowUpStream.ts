import { useCallback, useRef, useState } from "react";

type Message = { role: "user" | "assistant"; content: string };

export function useFollowUpStream(summaries: object[]) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [streamingText, setStreamingText] = useState("");
    const [isStreaming, setIsStreaming] = useState(false);
    const abortRef = useRef<AbortController | null>(null);

    const addAssistantMessage = useCallback((content: string) => {
        const trimmed = content.trim();
        if (!trimmed) return;

        setMessages((prev) => {
            const last = prev[prev.length - 1];
            if (
                last &&
                last.role === "assistant" &&
                last.content.trim() === trimmed
            ) {
                return prev;
            }
            return [...prev, { role: "assistant", content: trimmed }];
        });
    }, []);

    const sendMessage = async (question: string) => {
        const trimmedQuestion = question.trim();
        if (!trimmedQuestion || isStreaming) return;

        // Optimistically add the user message
        const userMessage: Message = { role: "user", content: trimmedQuestion };
        const updatedHistory = [...messages, userMessage];
        setMessages(updatedHistory);
        setStreamingText("");
        setIsStreaming(true);

        abortRef.current?.abort();
        abortRef.current = new AbortController();

        try {
            const res = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/api/v1/analysis/follow-up`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                    },
                    body: JSON.stringify({
                        question: trimmedQuestion,
                        summaries,
                        // send prior turns as history (exclude the message we just added)
                        history: messages.map((m) => ({
                            role: m.role,
                            content: m.content,
                        })),
                    }),
                    signal: abortRef.current.signal,
                },
            );

            if (!res.ok) throw new Error("Follow-up request failed");
            if (!res.body) throw new Error("Empty response body");

            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let fullResponse = "";
            let buffer = "";

            const commitAssistantResponse = () => {
                if (fullResponse.trim()) {
                    setMessages((prev) => [
                        ...prev,
                        { role: "assistant", content: fullResponse },
                    ]);
                }
                setStreamingText("");
                setIsStreaming(false);
            };

            const processBuffer = () => {
                const events = buffer.split("\n\n");
                buffer = events.pop() ?? "";

                for (const event of events) {
                    const lines = event
                        .split("\n")
                        .filter((line) => line.startsWith("data: "));

                    for (const line of lines) {
                        const raw = line.replace("data: ", "").trim();
                        if (!raw) continue;
                        if (raw === "[DONE]") {
                            commitAssistantResponse();
                            return true;
                        }

                        let parsed: any;
                        try {
                            parsed = JSON.parse(raw);
                        } catch {
                            continue;
                        }

                        if (parsed.done) {
                            commitAssistantResponse();
                            return true;
                        }

                        if (
                            typeof parsed.text === "string" &&
                            parsed.text.length > 0
                        ) {
                            fullResponse += parsed.text;
                            setStreamingText(fullResponse);
                        }
                    }
                }

                return false;
            };

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                if (processBuffer()) return;
            }

            buffer += decoder.decode();
            if (processBuffer()) return;
            commitAssistantResponse();
        } catch (err: any) {
            if (err.name !== "AbortError") setIsStreaming(false);
        }
    };

    return {
        messages,
        streamingText,
        isStreaming,
        sendMessage,
        addAssistantMessage,
    };
}
