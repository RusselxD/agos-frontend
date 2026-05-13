import Background from "./components/Background";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Architecture from "./components/Architecture";
import Features from "./components/Features";
import Footer from "./components/Footer";

export default function Landing() {
    return (
        <div className="min-h-screen bg-slate-50 relative text-slate-800 font-sans selection:bg-blue-100">
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
