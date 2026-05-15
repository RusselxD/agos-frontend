import { Activity, ShieldCheck, Waves } from "lucide-react";

export default function DesktopLoginFrame() {
    return (
        <div className="hidden lg:block w-4/5 relative">
            <img
                src="/auth-layout-bg.png"
                className="h-screen w-full object-cover"
                alt="Login Frame"
            />
            <div className="absolute left-10 bottom-10 text-white z-30">
                <img
                    src="/agos.svg"
                    alt="AGOS Logo"
                    className="w-16 h-16 object-cover mb-4 drop-shadow-2xl"
                />
                <h1 className="font-bold text-6xl tracking-tighter drop-shadow-lg">AGOS</h1>
                <p className="text-lg font-medium text-white/80 mt-2 max-w-md leading-relaxed drop-shadow-md">
                    Urban Waterway Intelligence
                </p>
            </div>

            {/* Floating UI Elements - Reverted & Polished */}
            <div className="absolute top-[15%] left-[45%] z-20 hidden xl:block animate-bounce-slow">
                <div className="bg-white/20 backdrop-blur-xl border border-white/30 p-4 rounded-2xl shadow-2xl flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-500/30 rounded-xl flex items-center justify-center border border-blue-400/40">
                        <Waves className="text-blue-100 w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest">Live Water Level</p>
                        <p className="text-white text-2xl font-black">1.42<span className="text-sm font-medium ml-1 text-white/70">m</span></p>
                    </div>
                </div>
            </div>

            <div className="absolute top-[35%] left-[15%] z-20 hidden xl:block animate-float">
                <div className="bg-white/20 backdrop-blur-xl border border-white/30 p-4 rounded-2xl shadow-2xl flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-500/30 rounded-xl flex items-center justify-center border border-emerald-400/40">
                        <ShieldCheck className="text-emerald-100 w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest">AI Analysis</p>
                        <p className="text-white text-lg font-bold">Clear Flow</p>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-[25%] left-[35%] z-20 hidden xl:block animate-float" style={{ animationDelay: "1.5s" }}>
                <div className="bg-white/20 backdrop-blur-xl border border-white/30 p-4 rounded-2xl shadow-2xl flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-500/30 rounded-xl flex items-center justify-center border border-amber-400/40">
                        <Activity className="text-amber-100 w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest">System Status</p>
                        <p className="text-white text-lg font-bold">Online</p>
                    </div>
                </div>
            </div>

            {/* Premium Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent z-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/20 via-transparent to-transparent z-10" />
        </div>
    );
}
