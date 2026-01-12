interface AuthHeaderProps {
    title: string;
    subtitle: string;
}

export default function AuthHeader({ title, subtitle }: AuthHeaderProps) {
    return (
        <div className="flex flex-col items-center gap-1 lg:gap-4 text-center">
            <p className="font-extrabold text-3xl xl:text-[2.5rem]">{title}</p>
            <p className="font-semibold text-gray-600 text-sm lg:text-base">
                {subtitle}
            </p>
        </div>
    );
}
