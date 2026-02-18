import { useState, useRef } from "react";

export type AnalysisStatus =
    | "idle"
    | "loading"
    | "streaming"
    | "done"
    | "error";

export type AnalysisPayload = {
    start_date: string;
    end_date: string;
    summaries: object[];
};

export function useAnalysisStream() {
    const [text, setText] = useState("");
    const [status, setStatus] = useState<AnalysisStatus>("idle");
    const abortRef = useRef<AbortController | null>(null);

    const analyze = async (payload: AnalysisPayload) => {
        abortRef.current?.abort();
        abortRef.current = new AbortController();

        setText("");
        setStatus("loading");

        try {
            const res = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/api/v1/analysis/daily-summaries`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                    },
                    body: JSON.stringify(payload),
                    signal: abortRef.current.signal,
                },
            );

            if (!res.ok) throw new Error("Failed");
            if (!res.body) throw new Error("Empty response body");

            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let buffer = "";
            setStatus("streaming");

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
                            setStatus("done");
                            return true;
                        }

                        let parsed: any;
                        try {
                            parsed = JSON.parse(raw);
                        } catch {
                            continue;
                        }

                        if (parsed.done) {
                            setStatus("done");
                            return true;
                        }

                        if (
                            typeof parsed.text === "string" &&
                            parsed.text.length > 0
                        ) {
                            setText((prev) => prev + parsed.text);
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
            setStatus((prev) => (prev === "streaming" ? "done" : prev));
        } catch (err: any) {
            if (err.name !== "AbortError") setStatus("error");
        }
    };

    const reset = () => {
        abortRef.current?.abort();
        setText("");
        setStatus("idle");
    };

    return { text, status, analyze, reset };
}
