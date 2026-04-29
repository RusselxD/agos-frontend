export default function ResponderGroupsLoadingSkeleton() {
    return (
        <div className="pt-4">
            <div className="skeleton h-10 w-full rounded-md" />
            <div className="mt-5 grid grid-cols-1 gap-3 lg:grid-cols-2 lg:gap-5">
                <div className="skeleton h-32 w-full rounded-md" />
                <div className="skeleton h-32 w-full rounded-md" />
                <div className="skeleton h-32 w-full rounded-md" />
                <div className="skeleton h-32 w-full rounded-md" />
                <div className="skeleton h-32 w-full rounded-md" />
            </div>
        </div>
    );
}
