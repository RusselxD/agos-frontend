import Container from "../../../../../components/ui/Container";

export default function TableSkeleton() {
    return (
        <Container
            headerTitle="SENSOR READINGS"
            className="flex-1 flex flex-col"
        >
            <div className="space-y-3">
                {Array.from({ length: 7 }).map((_, index) => {
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
