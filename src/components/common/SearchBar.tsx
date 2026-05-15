import { Search } from "lucide-react";

interface SearchBarProps {
    placeholder: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function SearchBar({ placeholder, value, onChange }: SearchBarProps) {
    return (
        <div className="bg-white dark:bg-slate-800 p-2 md:p-3 rounded-lg w-full sm:flex-1 sm:max-w-md custom-shadow transition-colors">
            <label className="relative w-full block" title="Search">
                <input
                    type="text"
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="w-full pl-10 pr-4 peer bg-gray-100 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary/30 dark:focus:ring-slate-600 text-slate-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500 transition-all py-2.5 md:py-3"
                />
                <Search
                    className="absolute text-gray-500 dark:text-slate-500 peer-focus:text-gray-900 dark:peer-focus:text-slate-200 left-3 top-0 h-full transition-colors"
                    size={20}
                />
            </label>
        </div>
    );
}
