import Container from "../ui/Container";

export default function TableSkeleton({
    title,
    rows,
}: {
    title: string;
    rows: number;
}) {
    return (
        <Container headerTitle={title} className="flex min-w-0 flex-1 flex-col">
            <div className="space-y-3">
                {Array.from({ length: rows }).map((_, index) => {
                    return (
                        <div
                            key={index}
                            className="skeleton rounded-md w-full h-10"
                        ></div>
                    );
                })}
            </div>
        </Container>
    );
}
