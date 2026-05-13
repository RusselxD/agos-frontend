import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

export default function Navbar() {
    const { isAuthenticated } = useAuth();

    const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            const navbarHeight = 64; // h-16 = 64px
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.scrollY - navbarHeight;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    };

    return (
        <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/80 border-b border-gray-200 shadow-sm transition-all">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center gap-2 relative z-10">
                        <div className="relative flex items-center justify-center w-10 h-10 bg-gray-50 rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                            <img
                                src="/agos.svg"
                                alt="AGOS Logo"
                                className="w-7 h-7 object-contain"
                            />
                        </div>
                        <span className="font-bold text-xl tracking-tight text-slate-900">
                            AGOS
                        </span>
                    </div>
                    <div className="flex items-center gap-6">
                        <a
                            href="#features"
                            onClick={(e) => scrollToSection(e, "features")}
                            className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors hidden sm:block"
                        >
                            Features
                        </a>
                        <a
                            href="#architecture"
                            onClick={(e) => scrollToSection(e, "architecture")}
                            className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors hidden sm:block"
                        >
                            Architecture
                        </a>
                        <Link
                            to="/public"
                            className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
                        >
                            Public Dashboard
                        </Link>
                        <div className="h-4 w-px bg-gray-300 hidden sm:block"></div>
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
                                className="text-sm font-semibold bg-white text-slate-700 px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg hover:bg-gray-50 transition-all border border-gray-300 shadow-sm active:scale-95"
                            >
                                Sign In
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}