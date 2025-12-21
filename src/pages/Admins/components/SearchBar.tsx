import { Search } from "lucide-react";

export default function SearchBar() {
    return (
        <label className="relative w-96" title="Search Admins">
            <input
                type="text"
                placeholder="Search admins"
                className="w-full pl-10 pr-4 peer py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
            />
            <Search className="absolute text-gray-500 peer-focus:text-gray-900 left-3 top-0 h-full" size={20} />
        </label>
    );
}
