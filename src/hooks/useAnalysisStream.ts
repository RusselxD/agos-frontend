import { useState, useRef, useEffect } from "react";

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
    const isMountedRef = useRef(true);

    useEffect(() => {
        return () => {
            isMountedRef.current = false;
            abortRef.current?.abort();
        };
    }, []);

    const analyze = async (payload: AnalysisPayload) => {
        abortRef.current?.abort();
        abortRef.current = new AbortController();

        if (isMountedRef.current) {
            setText("");
            setStatus("loading");
        }

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
            if (!res.body) throw new Error("No response body");

            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            if (isMountedRef.current) setStatus("streaming");

            // Buffer carried across reads: SSE frames can be split across
            // chunk boundaries, so only complete lines (terminated by "\n")
            // are parsed; the trailing partial stays in the buffer.
            let buffer = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });

                let newlineIndex: number;
                while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
                    const line = buffer.slice(0, newlineIndex);
                    buffer = buffer.slice(newlineIndex + 1);

                    if (!line.startsWith("data: ")) continue;

                    const parsed = JSON.parse(
                        line.replace("data: ", "").trim(),
                    );
                    if (parsed.done) {
                        if (isMountedRef.current) setStatus("done");
                        return;
                    }
                    if (parsed.text && isMountedRef.current) setText((prev) => prev + parsed.text);
                }
            }
        } catch (err: any) {
            if (err.name !== "AbortError" && isMountedRef.current) setStatus("error");
        }
    };

    const reset = () => {
        abortRef.current?.abort();
        setText("");
        setStatus("idle");
    };

    return { text, status, analyze, reset };
}
