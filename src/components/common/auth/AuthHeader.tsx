interface AuthHeaderProps {
    title: string;
    subtitle: string;
}

export default function AuthHeader({ title, subtitle }: AuthHeaderProps) {
    return (
        <div className="flex flex-col items-center gap-1 lg:gap-4 text-center">
            <p className="font-extrabold text-3xl xl:text-[2.5rem] dark:text-slate-100">{title}</p>
            <p className="font-semibold text-gray-600 dark:text-slate-400 text-sm lg:text-base">
                {subtitle}
            </p>
        </div>
    );
}
