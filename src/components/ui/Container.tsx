import type { ReactNode } from "react";

interface ContainerProps {
    children: ReactNode;
    headerTitle?: string;
    className?: string;
}

const ContainerHeader = ({ title }: { title: string }) => {
    return (
        <div className="flex items-center gap-3 mb-4">
            <div className="w-1.5 h-4 bg-gradient-to-b from-blue-400 to-primary rounded-full shadow-[0_0_8px_rgba(59,130,246,0.6)]"></div>
            <h2 className="font-bold text-xs md:text-sm tracking-widest text-slate-700 dark:text-slate-300 uppercase">
                {title}
            </h2>
        </div>
    );
};

export default function Container({
    headerTitle,
    className,
    children,
}: ContainerProps) {
    return (
        <div className={`relative overflow-hidden bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl border border-white/40 dark:border-white/5 shadow-xl shadow-slate-200/50 dark:shadow-black/50 rounded-2xl p-4 md:p-6 transition-all duration-300 hover:shadow-2xl hover:dark:border-white/10 ${className}`}>
            {headerTitle && <ContainerHeader title={headerTitle} />}
            {children}
            {/* Subtle inner top highlight */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 dark:via-white/10 to-transparent pointer-events-none !mt-0"></div>
        </div>
    );
}
