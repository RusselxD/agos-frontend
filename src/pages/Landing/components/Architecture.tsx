import {
    Activity,
    Waves,
    Bell,
    Zap,
    Shield,
    ChevronRight,
    ChevronDown,
    Smartphone,
    Cpu,
    Cloud,
    Database,
} from "lucide-react";

export default function Architecture() {
    return (
        <div
            id="architecture"
            className="py-16 sm:py-24 lg:py-32 relative z-10 border-t border-white/5 bg-[#0A0F1C]/50 backdrop-blur-xl"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-12 sm:mb-16">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white mb-3 sm:mb-4">
                        The AGOS Pipeline
                    </h2>
                    <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto">
                        A seamless flow from edge hardware to end-user mobile
                        devices, ensuring real-time reliability when seconds
                        matter.
                    </p>
                </div>

                {/* Diagram */}
                <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-10">
                    {/* Edge Layer */}
                    <div className="flex-1 bg-[#111827]/60 border border-white/5 p-6 sm:p-8 rounded-3xl w-full text-center hover:border-blue-500/30 transition-all duration-300 group">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-5 sm:mb-6 border border-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                            <Cpu className="w-7 h-7 sm:w-8 sm:h-8 text-blue-400" />
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                            1. Edge Hardware
                        </h3>
                        <p className="text-slate-400 text-xs sm:text-sm mb-4">
                            IoT devices deployed at waterways.
                        </p>
                        <div className="flex flex-col gap-3 text-left">
                            <div className="bg-white/5 p-3 rounded-xl border border-white/5 flex items-center gap-3">
                                <Waves className="w-5 h-5 text-blue-400 shrink-0" />
                                <span className="text-slate-300 text-xs sm:text-sm font-medium">
                                    Ultrasonic Distance Sensor
                                </span>
                            </div>
                            <div className="bg-white/5 p-3 rounded-xl border border-white/5 flex items-center gap-3">
                                <Shield className="w-5 h-5 text-blue-400 shrink-0" />
                                <span className="text-slate-300 text-xs sm:text-sm font-medium">
                                    Raspberry Pi & IR-Cut Camera
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Arrow */}
                    <div className="hidden lg:flex text-slate-700">
                        <ChevronRight className="w-10 h-10" />
                    </div>
                    <div className="flex lg:hidden text-slate-700 my-[-10px] sm:my-0">
                        <ChevronDown className="w-8 h-8" />
                    </div>

                    {/* Backend Layer */}
                    <div className="flex-1 bg-[#111827]/60 border border-white/5 p-6 sm:p-8 rounded-3xl w-full text-center hover:border-cyan-500/30 transition-all duration-300 relative group">
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.5)] whitespace-nowrap">
                            FastAPI & PostgreSQL
                        </div>
                        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-cyan-500/10 rounded-2xl flex items-center justify-center mx-auto mb-5 sm:mb-6 border border-cyan-500/20 group-hover:scale-110 transition-transform duration-300">
                            <Cloud className="w-7 h-7 sm:w-8 sm:h-8 text-cyan-400" />
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                            2. Cloud Processing
                        </h3>
                        <p className="text-slate-400 text-xs sm:text-sm mb-4">
                            Real-time fusion & AI analysis.
                        </p>
                        <div className="flex flex-col gap-3 text-left">
                            <div className="bg-white/5 p-3 rounded-xl border border-white/5 flex items-center gap-3">
                                <Zap className="w-5 h-5 text-cyan-400 shrink-0" />
                                <span className="text-slate-300 text-xs sm:text-sm font-medium">
                                    ML Blockage Inference
                                </span>
                            </div>
                            <div className="bg-white/5 p-3 rounded-xl border border-white/5 flex items-center gap-3">
                                <Database className="w-5 h-5 text-cyan-400 shrink-0" />
                                <span className="text-slate-300 text-xs sm:text-sm font-medium">
                                    WebSocket & Fusion Engine
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Arrow */}
                    <div className="hidden lg:flex text-slate-700">
                        <ChevronRight className="w-10 h-10" />
                    </div>
                    <div className="flex lg:hidden text-slate-700 my-[-10px] sm:my-0">
                        <ChevronDown className="w-8 h-8" />
                    </div>

                    {/* Client Layer */}
                    <div className="flex-1 bg-[#111827]/60 border border-white/5 p-6 sm:p-8 rounded-3xl w-full text-center hover:border-emerald-500/30 transition-all duration-300 group">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-5 sm:mb-6 border border-emerald-500/20 group-hover:scale-110 transition-transform duration-300">
                            <Smartphone className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-400" />
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                            3. Actionable UX
                        </h3>
                        <p className="text-slate-400 text-xs sm:text-sm mb-4">
                            Interfaces for LGU admins, responders, & residents.
                        </p>
                        <div className="flex flex-col gap-3 text-left">
                            <div className="bg-white/5 p-3 rounded-xl border border-white/5 flex items-center gap-3">
                                <Activity className="w-5 h-5 text-emerald-400 shrink-0" />
                                <span className="text-slate-300 text-xs sm:text-sm font-medium">
                                    Web Dashboard & Public Page
                                </span>
                            </div>
                            <div className="bg-white/5 p-3 rounded-xl border border-white/5 flex items-center gap-3">
                                <Bell className="w-5 h-5 text-emerald-400 shrink-0" />
                                <span className="text-slate-300 text-xs sm:text-sm font-medium">
                                    Mobile App for Field Personnel
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
