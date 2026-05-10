import { Search } from "lucide-react";

export default function SearchBar({placeholder}: {placeholder: string}) {
    return (
        <div className="bg-white p-3 rounded-lg w-3/5">
            <label className="relative w-96" title="Search Admins">
                <input
                    type="text"
                    placeholder={placeholder}
                    className="w-[90%] pl-10 pr-4 peer bg-gray-100 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gray-200"
                />
                <Search
                    className="absolute text-gray-500 peer-focus:text-gray-900 left-3 top-0 h-full"
                    size={20}
                />
            </label>
        </div>
    );
}
