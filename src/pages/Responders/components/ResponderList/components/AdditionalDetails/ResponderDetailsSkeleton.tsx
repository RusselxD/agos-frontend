export default function ResponderDetailsSkeleton() {
    return (
        <div className="space-y-3">
            <div className="skeleton h-24 w-full rounded-xl"></div>
            <div className="skeleton h-16 w-full rounded-xl"></div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-1">
                <div className="h-16 w-full rounded-xl skeleton"></div>
                <div className="h-16 w-full rounded-xl skeleton"></div>
            </div>
            <div className="h-16 w-full rounded-xl skeleton"></div>
            <div className="h-16 w-full rounded-xl skeleton"></div>
        </div>
    );
}
