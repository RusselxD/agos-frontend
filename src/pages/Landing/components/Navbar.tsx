import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { useTheme } from "../../../context/ThemeContext";
import { Sun, Moon } from "lucide-react";

export default function Navbar() {
    const { isAuthenticated } = useAuth();
    const { mode, setMode } = useTheme();

    const toggleTheme = () => {
        setMode(mode === "dark" ? "light" : "dark");
    };

    const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (!element) return;

        const navbarHeight = 64; // h-16 = 64px
        // The landing page scrolls inside the .custom-scrollbar container,
        // not the window, so scroll that ancestor when present.
        const container = element.closest<HTMLElement>(".custom-scrollbar");

        if (container) {
            const offsetPosition =
                element.getBoundingClientRect().top -
                container.getBoundingClientRect().top +
                container.scrollTop -
                navbarHeight;
            container.scrollTo({ top: offsetPosition, behavior: "smooth" });
        } else {
            const offsetPosition =
                element.getBoundingClientRect().top + window.scrollY - navbarHeight;
            window.scrollTo({ top: offsetPosition, behavior: "smooth" });
        }
    };

    return (
        <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-gray-200 dark:border-slate-800 shadow-sm transition-all">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center gap-2 relative z-10">
                        <div className="relative flex items-center justify-center w-10 h-10 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden shadow-sm">
                            <img
                                src="/agos.svg"
                                alt="AGOS Logo"
                                className="w-7 h-7 object-contain"
                            />
                        </div>
                        <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">
                            AGOS
                        </span>
                    </div>
                    <div className="flex items-center gap-4 sm:gap-6">
                        <a
                            href="#features"
                            onClick={(e) => scrollToSection(e, "features")}
                            className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors hidden sm:block"
                        >
                            Features
                        </a>
                        <a
                            href="#architecture"
                            onClick={(e) => scrollToSection(e, "architecture")}
                            className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors hidden sm:block"
                        >
                            Architecture
                        </a>
                        <Link
                            to="/public"
                            className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                            Public Dashboard
                        </Link>
                        <div className="h-4 w-px bg-gray-300 dark:bg-slate-700 hidden sm:block"></div>
                        {isAuthenticated ? (
                            <Link
                                to="/admin"
                                className="text-sm font-semibold bg-blue-600 text-white px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg hover:bg-blue-700 transition-all shadow-md active:scale-95 border border-blue-600"
                            >
                                Admin Dashboard
                            </Link>
                        ) : (
                            <Link
                                to="/auth/login"
                                className="text-sm font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-all border border-gray-300 dark:border-slate-600 shadow-sm active:scale-95"
                            >
                                Sign In
                            </Link>
                        )}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                            aria-label="Toggle dark mode"
                        >
                            {mode === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}