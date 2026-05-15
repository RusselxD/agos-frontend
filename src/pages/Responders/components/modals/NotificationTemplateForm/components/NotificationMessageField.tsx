import { MESSAGE_LENGTH } from "../constants";

interface NotificationMessageFieldProps {
    value: string;
    onChange: (value: string) => void;
}

export default function NotificationMessageField({
    value,
    onChange,
}: NotificationMessageFieldProps) {
    return (
        <label className="flex w-full flex-col">
            <span className="text-sm font-semibold text-gray-700 dark:text-slate-300">
                NOTIFICATION MESSAGE
            </span>
            <div className="relative mt-2 w-full">
                <textarea
                    value={value}
                    onChange={(e) =>
                        onChange(e.target.value.slice(0, MESSAGE_LENGTH))
                    }
                    rows={5}
                    maxLength={MESSAGE_LENGTH}
                    placeholder="Enter your message here"
                    className="w-full rounded-md border border-gray-400 dark:border-slate-600 bg-white dark:bg-slate-800 p-2.5 text-sm focus:border-gray-500 dark:focus:border-slate-500 text-neutral dark:text-slate-200 focus:outline-none transition-colors"
                ></textarea>
            </div>
            <p className="self-end text-xs text-gray-700 dark:text-slate-400">
                {`${value.length}/${MESSAGE_LENGTH} characters`}
            </p>
        </label>
    );
}
