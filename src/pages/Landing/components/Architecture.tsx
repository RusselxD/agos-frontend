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
            className="py-16 sm:py-24 lg:py-32 relative z-10 border-t border-gray-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-12 sm:mb-16">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-3 sm:mb-4">
                        The AGOS Pipeline
                    </h2>
                    <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                        A seamless flow from edge hardware to end-user mobile
                        devices, ensuring real-time reliability when seconds
                        matter.
                    </p>
                </div>

                {/* Diagram */}
                <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-10">
                    {/* Edge Layer */}
                    <div className="flex-1 bg-white dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md p-6 sm:p-8 rounded-3xl w-full text-center hover:border-blue-300 dark:hover:border-blue-500/50 hover:-translate-y-1 transition-all duration-300 group">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center mx-auto mb-5 sm:mb-6 border border-blue-100 dark:border-blue-900/50 group-hover:scale-110 transition-transform duration-300">
                            <Cpu className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-2">
                            1. Edge Hardware
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mb-4">
                            IoT devices deployed at waterways.
                        </p>
                        <div className="flex flex-col gap-3 text-left">
                            <div className="bg-gray-50 dark:bg-slate-700/50 p-3 rounded-xl border border-gray-100 dark:border-slate-600 flex items-center gap-3">
                                <Waves className="w-5 h-5 text-blue-500 dark:text-blue-400 shrink-0" />
                                <span className="text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-medium">
                                    Ultrasonic Distance Sensor
                                </span>
                            </div>
                            <div className="bg-gray-50 dark:bg-slate-700/50 p-3 rounded-xl border border-gray-100 dark:border-slate-600 flex items-center gap-3">
                                <Shield className="w-5 h-5 text-blue-500 dark:text-blue-400 shrink-0" />
                                <span className="text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-medium">
                                    Raspberry Pi & IR-Cut Camera
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Arrow */}
                    <div className="hidden lg:flex text-gray-400 dark:text-slate-600">
                        <ChevronRight className="w-10 h-10" />
                    </div>
                    <div className="flex lg:hidden text-gray-400 dark:text-slate-600 my-[-10px] sm:my-0">
                        <ChevronDown className="w-8 h-8" />
                    </div>

                    {/* Backend Layer */}
                    <div className="flex-1 bg-white dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md p-6 sm:p-8 rounded-3xl w-full text-center hover:border-cyan-300 dark:hover:border-cyan-500/50 hover:-translate-y-1 transition-all duration-300 relative group">
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full shadow-md whitespace-nowrap">
                            FastAPI & PostgreSQL
                        </div>
                        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-cyan-50 dark:bg-cyan-900/20 rounded-2xl flex items-center justify-center mx-auto mb-5 sm:mb-6 border border-cyan-100 dark:border-cyan-900/50 group-hover:scale-110 transition-transform duration-300">
                            <Cloud className="w-7 h-7 sm:w-8 sm:h-8 text-cyan-600 dark:text-cyan-400" />
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-2">
                            2. Cloud Processing
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mb-4">
                            Real-time fusion & AI analysis.
                        </p>
                        <div className="flex flex-col gap-3 text-left">
                            <div className="bg-gray-50 dark:bg-slate-700/50 p-3 rounded-xl border border-gray-100 dark:border-slate-600 flex items-center gap-3">
                                <Zap className="w-5 h-5 text-cyan-500 dark:text-cyan-400 shrink-0" />
                                <span className="text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-medium">
                                    ML Surface-Obstruction Inference
                                </span>
                            </div>
                            <div className="bg-gray-50 dark:bg-slate-700/50 p-3 rounded-xl border border-gray-100 dark:border-slate-600 flex items-center gap-3">
                                <Database className="w-5 h-5 text-cyan-500 dark:text-cyan-400 shrink-0" />
                                <span className="text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-medium">
                                    WebSocket & Fusion Engine
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Arrow */}
                    <div className="hidden lg:flex text-gray-400 dark:text-slate-600">
                        <ChevronRight className="w-10 h-10" />
                    </div>
                    <div className="flex lg:hidden text-gray-400 dark:text-slate-600 my-[-10px] sm:my-0">
                        <ChevronDown className="w-8 h-8" />
                    </div>

                    {/* Client Layer */}
                    <div className="flex-1 bg-white dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md p-6 sm:p-8 rounded-3xl w-full text-center hover:border-emerald-300 dark:hover:border-emerald-500/50 hover:-translate-y-1 transition-all duration-300 group">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center mx-auto mb-5 sm:mb-6 border border-emerald-100 dark:border-emerald-900/50 group-hover:scale-110 transition-transform duration-300">
                            <Smartphone className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-2">
                            3. Actionable UX
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mb-4">
                            Interfaces for LGU admins, responders, & residents.
                        </p>
                        <div className="flex flex-col gap-3 text-left">
                            <div className="bg-gray-50 dark:bg-slate-700/50 p-3 rounded-xl border border-gray-100 dark:border-slate-600 flex items-center gap-3">
                                <Activity className="w-5 h-5 text-emerald-500 dark:text-emerald-400 shrink-0" />
                                <span className="text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-medium">
                                    Web Dashboard & Public Page
                                </span>
                            </div>
                            <div className="bg-gray-50 dark:bg-slate-700/50 p-3 rounded-xl border border-gray-100 dark:border-slate-600 flex items-center gap-3">
                                <Bell className="w-5 h-5 text-emerald-500 dark:text-emerald-400 shrink-0" />
                                <span className="text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-medium">
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
