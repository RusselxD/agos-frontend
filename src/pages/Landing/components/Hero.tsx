import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Activity as ActivityIcon, CloudLightning, Waves, CheckCircle2, AlertCircle } from "lucide-react";

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
        <div className="relative pt-16 pb-20 sm:pt-24 sm:pb-28 lg:pt-32 lg:pb-32 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                
                <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">
                    
                    {/* Left Column: Text & CTA */}
                    <div className="lg:col-span-6 text-center lg:text-left mb-16 lg:mb-0">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6 leading-[1.1]">
                            Urban Waterway Intelligence, <br className="hidden sm:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-400">
                                Powered by AI.
                            </span>
                        </h1>
                        
                        <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed font-light max-w-2xl mx-auto lg:mx-0">
                            AGOS fuses computer vision, ultrasonic telemetry, and live weather data to give LGUs real-time visibility into drainage systems—predicting and mitigating flood risks before they escalate.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10">
                            <Link
                                to="/public"
                                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/30 border border-transparent"
                            >
                                Open Dashboard
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <a
                                href="#architecture"
                                onClick={scrollToArchitecture}
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 px-8 py-4 rounded-full font-semibold text-lg hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600 shadow-sm transition-all"
                            >
                                See Architecture
                            </a>
                        </div>

                        <div className="flex items-center justify-center lg:justify-start gap-6 text-sm text-slate-500 dark:text-slate-400 font-medium">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                Sub-second Telemetry
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                Vision AI Detection
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Abstract UI Graphic */}
                    <div className="lg:col-span-6 relative">
                        {/* Decorative background blobs */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-blue-100 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-full blur-3xl opacity-50 -z-10"></div>
                        
                        <div className="relative w-full max-w-lg mx-auto">
                            {/* Main Abstract Dashboard Glass Pane */}
                            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/80 dark:border-slate-700/80 shadow-2xl rounded-2xl p-6 relative z-10 transform lg:rotate-[-2deg] transition-transform hover:rotate-0 duration-500">
                                
                                {/* Header Mock */}
                                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-4 mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center border border-slate-200 dark:border-slate-600">
                                            <ActivityIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-bold text-slate-900 dark:text-white">F. Alarcon Creek</h3>
                                            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Active Stream
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Risk Level</p>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">Normal</p>
                                    </div>
                                </div>

                                {/* Mock Content Area */}
                                <div className="grid grid-cols-2 gap-4">
                                    {/* Widget 1 */}
                                    <div className="bg-white dark:bg-slate-800/80 rounded-xl p-4 border border-slate-100 dark:border-slate-700 shadow-sm">
                                        <div className="flex items-center gap-2 mb-3 text-slate-500 dark:text-slate-400">
                                            <Waves className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
                                            <span className="text-xs font-semibold uppercase tracking-wider">Water Level</span>
                                        </div>
                                        <div className="flex items-end gap-2">
                                            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">1.2<span className="text-lg text-slate-500 dark:text-slate-400 font-medium">m</span></span>
                                        </div>
                                        {/* Mock sparkline */}
                                        <div className="mt-3 flex items-end gap-1 h-8 opacity-70">
                                            <div className="w-full bg-cyan-100 dark:bg-cyan-900/50 rounded-t-sm h-[30%]"></div>
                                            <div className="w-full bg-cyan-100 dark:bg-cyan-900/50 rounded-t-sm h-[40%]"></div>
                                            <div className="w-full bg-cyan-100 dark:bg-cyan-900/50 rounded-t-sm h-[35%]"></div>
                                            <div className="w-full bg-cyan-100 dark:bg-cyan-900/50 rounded-t-sm h-[50%]"></div>
                                            <div className="w-full bg-cyan-400 dark:bg-cyan-500 rounded-t-sm h-[60%]"></div>
                                        </div>
                                    </div>

                                    {/* Widget 2 */}
                                    <div className="bg-white dark:bg-slate-800/80 rounded-xl p-4 border border-slate-100 dark:border-slate-700 shadow-sm">
                                        <div className="flex items-center gap-2 mb-3 text-slate-500 dark:text-slate-400">
                                            <ShieldCheck className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                                            <span className="text-xs font-semibold uppercase tracking-wider">Blockage AI</span>
                                        </div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">CLEAR</span>
                                        </div>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">Confidence: 98.4%</p>
                                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Last scan: 2s ago</p>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Alert Card */}
                            <div className="absolute -bottom-6 -right-6 bg-white dark:bg-slate-800 border border-rose-100 dark:border-rose-900/50 shadow-xl rounded-xl p-4 z-20 w-64 transform lg:rotate-[3deg] animate-[dropdown-in_0.5s_ease-out]">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center shrink-0">
                                        <AlertCircle className="w-4 h-4 text-rose-500 dark:text-rose-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-900 dark:text-white">Fusion Engine Alert</p>
                                        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">Risk tier escalated to CRITICAL. Water level rising rapidly combined with 98% blockage detected.</p>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Floating Weather Card */}
                            <div className="absolute -top-6 -left-6 bg-white dark:bg-slate-800 border border-blue-100 dark:border-blue-900/50 shadow-xl rounded-xl p-3 z-20 transform lg:-rotate-[3deg]">
                                <div className="flex items-center gap-3">
                                    <CloudLightning className="w-6 h-6 text-blue-500 dark:text-blue-400" />
                                    <div>
                                        <p className="text-xs font-bold text-slate-900 dark:text-white">Heavy Rain</p>
                                        <p className="text-[10px] text-slate-500 dark:text-slate-400">Expected at 14:00</p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}