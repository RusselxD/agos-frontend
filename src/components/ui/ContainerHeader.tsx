export default function ContainerHeader({ title }: { title: string }) {
    return (
        <h2 className="pl-2 border-l-4 font-semibold text-gray-600 border-primary w-full">
            {title}
        </h2>
    );
}
