export default function SmallScreenLoginFrame() {
    return (
        <div className="block lg:hidden fixed top-1/4 left-0 bottom-0 w-fit z-10">
            <img
                src="/auth-frame-small.png"
                className="h-full w-full"
                alt="Login Frame"
            />
        </div>
    );
}
