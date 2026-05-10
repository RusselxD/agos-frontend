import { Link } from "react-router-dom";
import { Activity, Server } from "lucide-react";

export default function Hero() {
    const scrollToArchitecture = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        const element = document.getElementById("architecture");
        if (element) {
            const navbarHeight = 64;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.scrollY - navbarHeight;
            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    };

    return (
        <div className="relative pt-16 pb-20 sm:pt-24 sm:pb-28 md:pt-32 md:pb-32">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-blue-500/10 text-blue-400 text-xs sm:text-sm font-semibold mb-6 sm:mb-8 border border-blue-500/20 backdrop-blur-md">
                    <span className="relative flex h-2 sm:h-2.5 w-2 sm:w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 sm:h-2.5 w-2 sm:w-2.5 bg-blue-500"></span>
                    </span>
                    SYSTEM LIVE & MONITORING
                </div>
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 sm:mb-8 leading-[1.1]">
                    Multi-Modal Drainage<br className="hidden sm:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-400 drop-shadow-sm">
                        {" "}
                        Waterway Monitoring System.
                    </span>
                </h1>
                <p className="max-w-3xl mx-auto text-base sm:text-lg md:text-xl lg:text-2xl text-slate-400 mb-8 sm:mb-12 leading-relaxed font-light">
                    AGOS automatically detects blockages and water level
                    conditions through computer vision and IoT sensor
                    integration, fusing collected data with real-time weather
                    information to generate risk-based alert tiers.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        to="/public"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-500 transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] border border-blue-500 hover:-translate-y-1"
                    >
                        <Activity className="w-5 h-5" />
                        Open Dashboard
                    </Link>
                    <a
                        href="#architecture"
                        onClick={scrollToArchitecture}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/5 text-white border border-white/10 px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/10 hover:border-white/20 transition-all hover:-translate-y-1 backdrop-blur-sm"
                    >
                        <Server className="w-5 h-5" />
                        View Architecture
                    </a>
                </div>
            </div>
        </div>
    );
}
