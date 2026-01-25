export default function ResponderDetailsSkeleton() {
    return (
        <>
            <div className="w-full h-10 rounded-md skeleton"></div>
            <div className="w-full h-28 rounded-md skeleton"></div>

            <div className="space-y-3">
                <div className="flex gap-3">
                    <div className="skeleton rounded-md w-full h-12"></div>
                    <div className="skeleton rounded-md w-full h-12"></div>
                </div>
                <div className="skeleton rounded-md w-full h-16"></div>
            </div>

            <div className="space-y-3">
                <div className="skeleton rounded-md h-5 w-2/4"></div>
                <div className="skeleton rounded-md h-20 w-full"></div>
            </div>
        </>
    );
}
