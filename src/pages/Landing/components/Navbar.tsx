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
        <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-[#0A0F1C]/80 border-b border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center gap-2 relative z-10">
                        <div className="relative flex items-center justify-center w-10 h-10 bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                            <img
                                src="/agos.svg"
                                alt="AGOS Logo"
                                className="w-7 h-7 object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                            />
                        </div>
                        <span className="font-bold text-xl tracking-tight text-white">
                            AGOS
                        </span>
                    </div>
                    <div className="flex items-center gap-6">
                        <a
                            href="#features"
                            onClick={(e) => scrollToSection(e, "features")}
                            className="text-sm font-medium text-slate-400 hover:text-white transition-colors hidden sm:block"
                        >
                            Features
                        </a>
                        <a
                            href="#architecture"
                            onClick={(e) => scrollToSection(e, "architecture")}
                            className="text-sm font-medium text-slate-400 hover:text-white transition-colors hidden sm:block"
                        >
                            Architecture
                        </a>
                        <Link
                            to="/public"
                            className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
                        >
                            Public Dashboard
                        </Link>
                        <div className="h-4 w-px bg-slate-800 hidden sm:block"></div>
                        {isAuthenticated ? (
                            <Link
                                to="/admin"
                                className="text-sm font-semibold bg-blue-600 text-white px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg hover:bg-blue-500 transition-all shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:shadow-[0_0_25px_rgba(37,99,235,0.4)] active:scale-95 border border-blue-500/50"
                            >
                                Admin Dashboard
                            </Link>
                        ) : (
                            <Link
                                to="/auth/login"
                                className="text-sm font-semibold bg-white/5 text-white px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg hover:bg-white/10 transition-all border border-white/10 hover:border-white/20 active:scale-95"
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
