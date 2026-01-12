export default function DesktopLoginFrame() {
    return (
        <div className="hidden lg:block w-4/5 relative">
            <img
                src="/auth-layout-bg.png"
                className="h-screen w-full object-cover"
                alt="Login Frame"
            />
            <div className="absolute left-10 bottom-10 text-white">
                <img
                    src="/agos.svg"
                    alt="AGOS Logo"
                    className="w-16 h-16 object-cover mb-3"
                />
                <h1 className="font-bold text-6xl">AGOS</h1>
                <p className="font-semibold text-lg">AI-Guided Surveillance System</p>
            </div>
        </div>
    );
}
