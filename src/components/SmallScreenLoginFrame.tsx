export default function SmallScreenLoginFrame() {
    return (
        <div className="flex relative lg:hidden h-[35dvh] w-screen overflow-hidden rounded-b-3xl">
            <img
                src="/auth-layout-bg.png"
                className="object-cover w-full h-full absolute inset-0"
                alt="Login Frame"
            />
            <div className="absolute left-5 md:left-10 bottom-5 md:bottom-10 text-white">
                <img
                    src="/agos.svg"
                    alt="AGOS Logo"
                    className="w-10 h-10 object-cover mb-3"
                />
                <h1 className="font-bold text-3xl">AGOS</h1>
                <p className="font-semibold text-sm">
                    AI-Guided Surveillance System
                </p>
            </div>
        </div>
    );
}
