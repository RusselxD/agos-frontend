export default function Background() {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40"></div>
            <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-blue-50/80 dark:from-background-dark/80 to-transparent"></div>
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-100/50 dark:bg-blue-900/20 rounded-full filter blur-[100px] animate-pulse"></div>
            <div
                className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-100/50 dark:bg-cyan-900/20 rounded-full filter blur-[100px] animate-pulse"
                style={{ animationDelay: "2s" }}
            ></div>
        </div>
    );
}