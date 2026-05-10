import { Link } from "react-router-dom";
import { Activity, Waves, Bell, Zap, Shield, ChevronRight } from "lucide-react";

export default function Features() {
    return (
        <div
            id="features"
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32 relative z-10 border-t border-white/5"
        >
            <div className="mb-12 sm:mb-16 md:text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 text-slate-300 text-xs font-bold mb-4 border border-white/10 uppercase tracking-widest">
                    Core Capabilities
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white">
                    Engineered for Resilience.
                </h2>
                <p className="mt-4 sm:mt-6 text-lg sm:text-xl text-slate-600 max-w-3xl md:mx-auto">
                    A comprehensive system empowering LGU administrators,
                    mobilizing field personnel, and informing barangay residents
                    with real-time waterway infrastructure status.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                {/* Feature 1 */}
                <div className="col-span-1 md:col-span-2 bg-gradient-to-br from-[#111827] to-[#0A0F1C] border border-white/5 rounded-3xl p-6 sm:p-8 lg:p-10 hover:border-blue-500/30 hover:shadow-[0_0_30px_rgba(37,99,235,0.1)] transition-all duration-500 relative overflow-hidden group">
                    <div className="absolute -top-10 -right-10 p-8 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500 hidden sm:block">
                        <Bell className="w-64 h-64 text-blue-400" />
                    </div>
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center mb-6 sm:mb-8 shadow-[inset_0_0_15px_rgba(37,99,235,0.2)]">
                        <Shield className="w-6 h-6 sm:w-7 sm:h-7 text-blue-400" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">
                        Field Personnel Notifications
                    </h3>
                    <p className="text-slate-400 text-sm sm:text-base md:text-lg max-w-md leading-relaxed">
                        Notifies field personnel through a dedicated mobile
                        application with instant alerts via VAPID Web Push and
                        an Android-powered SMS Gateway for critical risk tiers.
                    </p>
                </div>

                {/* Feature 2 */}
                <div className="col-span-1 bg-gradient-to-br from-[#111827] to-[#0A0F1C] border border-white/5 rounded-3xl p-6 sm:p-8 lg:p-10 hover:border-cyan-500/30 hover:shadow-[0_0_30px_rgba(6,182,212,0.1)] transition-all duration-500 group">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl flex items-center justify-center mb-6 sm:mb-8 shadow-[inset_0_0_15px_rgba(6,182,212,0.2)]">
                        <Waves className="w-6 h-6 sm:w-7 sm:h-7 text-cyan-400" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">
                        Ultrasonic Telemetry
                    </h3>
                    <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                        High-frequency, precision distance sensor tracking
                        provides reliable water level data, broadcast in
                        real-time to the dashboard via a WebSocket connection.
                    </p>
                </div>

                {/* Feature 3 */}
                <div className="col-span-1 bg-gradient-to-br from-[#111827] to-[#0A0F1C] border border-white/5 rounded-3xl p-6 sm:p-8 lg:p-10 hover:border-amber-500/30 hover:shadow-[0_0_30px_rgba(245,158,11,0.1)] transition-all duration-500 group">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-center mb-6 sm:mb-8 shadow-[inset_0_0_15px_rgba(245,158,11,0.2)]">
                        <Zap className="w-6 h-6 sm:w-7 sm:h-7 text-amber-400" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">
                        Vision AI Fusion
                    </h3>
                    <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                        Advanced machine learning models process live RTSP
                        camera feeds to identify trash and debris. Captured
                        frames are uploaded to Cloudinary for logging.
                    </p>
                </div>

                {/* Feature 4 */}
                <div className="col-span-1 md:col-span-2 bg-gradient-to-br from-indigo-900/40 to-[#0A0F1C] border border-indigo-500/20 rounded-3xl p-6 sm:p-8 lg:p-10 relative overflow-hidden group hover:border-indigo-500/40 transition-all duration-500">
                    <div className="absolute -right-10 -bottom-10 opacity-10 transform group-hover:scale-110 transition-transform duration-700 hidden sm:block">
                        <Activity className="w-64 h-64 text-indigo-400" />
                    </div>
                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-1.5 px-2 py-1 sm:px-3 sm:py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] sm:text-xs font-bold tracking-wide mb-4 sm:mb-6 border border-indigo-500/30 shadow-[0_0_10px_rgba(99,102,241,0.2)]">
                            POWERED BY GROQ
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-3 sm:mb-4 drop-shadow-md">
                            Predictive Analysis Engine
                        </h3>
                        <p className="text-slate-300 max-w-lg mb-6 sm:mb-8 text-sm sm:text-base md:text-lg leading-relaxed">
                            AGOS fuses live sensor data, computer vision
                            results, and OpenMeteo weather forecasts to
                            calculate risk scores. Daily summaries are analyzed
                            by the Groq LLM via SSE streaming to provide
                            predictive text analysis.
                        </p>
                        <Link
                            to="/public"
                            className="inline-flex items-center text-sm sm:text-base font-bold text-indigo-300 hover:text-white transition-colors group/link"
                        >
                            Explore Live Data{" "}
                            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 ml-1 transform group-hover/link:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
