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

            const reader = res.body!.getReader();
            const decoder = new TextDecoder();
            if (isMountedRef.current) setStatus("streaming");

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
