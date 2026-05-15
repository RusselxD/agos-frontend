import { Activity } from "lucide-react";

export default function SmallScreenLoginFrame() {
    return (
        <div className="flex relative lg:hidden h-[35dvh] w-screen overflow-hidden rounded-b-3xl">
            <img
                src="/auth-layout-bg.png"
                className="object-cover w-full h-full absolute inset-0"
                alt="Login Frame"
            />
            <div className="absolute left-5 md:left-10 bottom-5 md:bottom-10 text-white z-20">
                <img
                    src="/agos.svg"
                    alt="AGOS Logo"
                    className="w-10 h-10 object-cover mb-2 drop-shadow-lg"
                />
                <h1 className="font-bold text-3xl tracking-tight drop-shadow-md">AGOS</h1>
                <p className="text-sm font-medium text-white/80 drop-shadow-sm">Urban Waterway Intelligence</p>
            </div>

            {/* Floating Element for Mobile */}
            <div className="absolute top-6 right-6 z-20 animate-pulse-slow">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 px-3 py-2 rounded-xl shadow-xl flex items-center gap-3">
                    <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center border border-emerald-400/30">
                        <Activity className="text-emerald-400 w-4 h-4" />
                    </div>
                    <div className="hidden sm:block">
                        <p className="text-white/60 text-[8px] font-bold uppercase tracking-widest">System</p>
                        <p className="text-white text-[10px] font-bold tracking-wide">ACTIVE</p>
                    </div>
                </div>
            </div>

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent z-10" />
        </div>
    );
}
