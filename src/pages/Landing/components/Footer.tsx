export default function Footer() {
    return (
        <footer className="border-t border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 relative z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="relative flex items-center justify-center w-8 h-8 bg-gray-50 dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 shadow-sm">
                        <img
                            src="/agos.svg"
                            alt="AGOS Logo"
                            className="w-5 h-5 object-contain"
                        />
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white text-lg">AGOS</span>
                </div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    &copy; {new Date().getFullYear()} AGOS
                </p>
            </div>
        </footer>
    );
}