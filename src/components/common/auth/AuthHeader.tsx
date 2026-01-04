interface AuthHeaderProps {
    title: string;
    subtitle: string;
}

export default function AuthHeader({ title, subtitle }: AuthHeaderProps) {
    return (
        <div className="flex flex-col items-center gap-2 text-center">
            <p className="font-extrabold text-3xl xl:text-[2.5rem]">{title}</p>
            <p className="font-semibold text-gray-600">{subtitle}</p>
        </div>
    );
}
