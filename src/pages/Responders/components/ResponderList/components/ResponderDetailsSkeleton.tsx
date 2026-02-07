export default function ResponderDetailsSkeleton() {
    return (
        <div className="space-y-3">
            <div className="skeleton w-full rounded-md h-8"></div>
            <div className="skeleton w-full rounded-md h-16"></div>
            <div className="grid grid-cols-2 gap-2">
                <div className="w-full h-16 skeleton rounded-md"></div>
                <div className="w-full h-16 skeleton rounded-md"></div>
                <div className="w-full h-16 skeleton rounded-md"></div>
                <div className="w-full h-16 skeleton rounded-md"></div>
            </div>
        </div>
    );
}
