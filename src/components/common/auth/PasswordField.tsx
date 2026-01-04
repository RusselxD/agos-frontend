import { Eye, EyeClosed } from "lucide-react";
import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";

interface PasswordFieldProps {
    label: string;
    placeholder: string;
    password: string;
    setPassword: Dispatch<SetStateAction<string>> | ((value: string) => void);
}

export default function PasswordField({
    label,
    placeholder,
    password,
    setPassword,
}: PasswordFieldProps) {
    const [showPassword, setShowPassword] = useState<boolean>(false);

    return (
        <label className="flex flex-col">
            <span className="text-sm text-gray-700 font-semibold">{label}</span>
            <div className="w-full relative">
                <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={placeholder}
                    className="custom-input w-full pr-12"
                />
                <div
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute cursor-pointer right-3 top-2"
                >
                    {showPassword ? <Eye /> : <EyeClosed />}
                </div>
            </div>
        </label>
    );
}
