import type {
    KeyboardEvent,
    Dispatch,
    SetStateAction,
    ClipboardEvent,
    RefObject,
} from "react";

interface InputOTPFieldProps {
    shouldResend: boolean;
    isLoading: boolean;
    errorMessage: string;
    otp: string[];
    setOtp: Dispatch<SetStateAction<string[]>>;
    setErrorMessage: Dispatch<SetStateAction<string>>;
    handleVerify: (code: string) => Promise<void>;
    inputRefs: RefObject<(HTMLInputElement | null)[]>;
}

export default function InputOTPField({
    shouldResend,
    isLoading,
    errorMessage,
    otp,
    setOtp,
    setErrorMessage,
    handleVerify,
    inputRefs,
}: InputOTPFieldProps) {
    const handleChange = (value: string, index: number) => {
        if (isLoading) return;

        // Prevent non-numeric characters
        if (value && !/^\d+$/.test(value)) return;

        // Clear error on input
        if (errorMessage) setErrorMessage("");

        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);

        const currentCode = newOtp.join("");

        // 1. Auto-submit if full
        if (currentCode.length === 6) {
            handleVerify(currentCode);
        }
        // 2. Otherwise jump focus forward
        else if (value && index < 5) {
            inputRefs.current?.[index + 1]?.focus();
        }
    };

    // prevents the user from clicking out of order
    const handleClick = (index: number) => {
        // Find the first empty index
        const firstEmptyIndex = otp.findIndex((val) => val === "");

        // If the user clicks a box further than the first empty one,
        // or if the whole thing is full and they click a middle box
        if (firstEmptyIndex !== -1 && index > firstEmptyIndex) {
            inputRefs.current?.[firstEmptyIndex]?.focus();
        }
    };

    const handleKeyDown = (e: KeyboardEvent, index: number) => {
        // Prevent moving the cursor with arrow keys
        if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
            e.preventDefault();
            return;
        }

        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current?.[index - 1]?.focus();
        }
    };

    const handlePaste = (e: ClipboardEvent) => {
        e.preventDefault();
        const data = e.clipboardData.getData("text").slice(0, 6);
        if (!/^\d+$/.test(data)) return;

        const newOtp = data.split("");
        // Fill the array and fill remaining slots with empty strings if pasted code is short
        const fullOtp = [...newOtp, ...new Array(6 - newOtp.length).fill("")];
        setOtp(fullOtp);

        // Auto-verify if they pasted a full 6-digit code
        if (data.length === 6) {
            handleVerify(data);
        } else {
            // Focus the next empty box
            inputRefs.current?.[data.length]?.focus();
        }
    };

    return (
        <label className="flex flex-col items-center w-full">
            <div className="w-full flex items-center justify-center gap-2">
                {otp.map((digit, index) => (
                    <input
                        disabled={isLoading || shouldResend}
                        key={index}
                        type="text"
                        ref={(el) => {
                            if (inputRefs.current) {
                                inputRefs.current[index] = el;
                            }
                        }}
                        value={digit}
                        // Snap focus back if they click out of order
                        onClick={() => handleClick(index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        onChange={(e) => {
                            handleChange(e.target.value, index);
                        }}
                        onPaste={(e) => handlePaste(e)}
                        inputMode="numeric"
                        autoComplete="one-time-code" // Helps mobile browsers auto-fill
                        pattern="[0-9]*"
                        className="w-16 h-16 text-center border-2 text-xl rounded-md focus:border-gray-400 outline-none"
                    />
                ))}
            </div>
        </label>
    );
}
