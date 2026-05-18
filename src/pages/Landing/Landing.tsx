import Background from "./components/Background";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Architecture from "./components/Architecture";
import Features from "./components/Features";
import Footer from "./components/Footer";

export default function Landing() {
    return (
        <div className="h-screen overflow-y-auto custom-scrollbar bg-slate-50 dark:bg-background-dark relative text-slate-800 dark:text-slate-200 font-sans selection:bg-blue-100 dark:selection:bg-blue-900/50">
            <Background />
            <Navbar />

            <main className="relative z-10">
                <Hero />
                <Architecture />
                <Features />
            </main>

            <Footer />
        </div>
    );
}
