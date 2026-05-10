export default function Footer() {
    return (
        <footer className="border-t border-white/5 bg-[#0A0F1C] relative z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="relative flex items-center justify-center w-8 h-8 bg-white/5 rounded-lg border border-white/10">
                        <img
                            src="/agos.svg"
                            alt="AGOS Logo"
                            className="w-5 h-5 object-contain"
                        />
                    </div>
                    <span className="font-bold text-white text-lg">AGOS</span>
                </div>
                <p className="text-sm font-medium text-slate-500">
                    &copy; {new Date().getFullYear()} AGOS
                </p>
            </div>
        </footer>
    );
}
