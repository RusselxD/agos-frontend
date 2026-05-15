import { Search } from "lucide-react";

interface SearchBarProps {
    placeholder: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function SearchBar({ placeholder, value, onChange }: SearchBarProps) {
    return (
        <div className="bg-white/60 dark:bg-white/[0.03] backdrop-blur-xl p-2 md:p-3 rounded-2xl w-full sm:flex-1 sm:max-w-md shadow-xl border border-white/50 dark:border-white/10 transition-all duration-300">
            <label className="relative w-full block" title="Search">
                <input
                    type="text"
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="w-full pl-11 pr-4 peer bg-white/40 dark:bg-white/[0.02] border border-gray-200/50 dark:border-white/5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-blue-500/20 text-slate-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500 transition-all py-3"
                />
                <Search
                    className="absolute text-gray-500 dark:text-slate-500 peer-focus:text-gray-900 dark:peer-focus:text-slate-200 left-3.5 top-0 h-full transition-colors"
                    size={20}
                />
            </label>
        </div>
    );
}
