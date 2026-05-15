import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LogIn } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { coreAPI } from "../../lib/api/core";
import type { LocationDetails } from "../../types/core";
import { WebSocketProvider } from "../../context/WebSocketContext";
import { BlockageProvider } from "../../context/BlockageContext";
import { WeatherProvider } from "../../context/WeatherContext";
import { WaterLevelProvider } from "../../context/WaterLevelContext";
import { FusionAnalysisProvider } from "../../context/FusionAnalysisContext";
import ErrorBoundary from "../../components/common/ErrorBoundary";
import BlockageStatusCard from "../Dashboard/components/BlockageStatusCard";
import WeatherConditionCard from "../Dashboard/components/WeatherConditionCard";
import WaterLevelStatusCard from "../Dashboard/components/WaterLevelStatusCard";
import FusionAnalysis from "../Dashboard/components/FusionAnalysis";

export default function Public() {
    const { isAuthChecking } = useAuth();
    const [location, setLocation] = useState<LocationDetails | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        document.title = "AGOS - Public Dashboard";
        coreAPI
            .getPublicLocationDetails()
            .then(setLocation)
            .catch(() => setError("Failed to load location data."));

        return () => {
            document.title = "AGOS";
        };
    }, []);

    if (isAuthChecking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background dark:bg-background-dark text-slate-900 dark:text-slate-200">
                <div className="spinner w-6 h-6 border-blue-600 dark:border-blue-400" />
            </div>
        );
    }

    // Removed redirect: allow authenticated admins to view the public dashboard

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background dark:bg-background-dark text-slate-900 dark:text-slate-200">
                <p className="text-gray-500 dark:text-slate-400">{error}</p>
            </div>
        );
    }

    if (!location || !location.location_id) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background dark:bg-background-dark text-slate-900 dark:text-slate-200">
                <div className="spinner w-6 h-6 border-blue-600 dark:border-blue-400" />
            </div>
        );
    }

    return (
        <WebSocketProvider locationId={location.location_id}>
            <BlockageProvider>
                <WeatherProvider>
                    <WaterLevelProvider locationId={location.location_id}>
                        <FusionAnalysisProvider isPublic>
                            <div className="min-h-screen bg-background dark:bg-dark-gradient bg-fixed text-slate-900 dark:text-slate-200 transition-colors duration-300">
                                <Header locationName={location.location_name} />
                                <main className="max-w-7xl mx-auto px-4 py-6">
                                    <ErrorBoundary>
                                        <StatusCards />
                                    </ErrorBoundary>
                                </main>
                            </div>
                        </FusionAnalysisProvider>
                    </WaterLevelProvider>
                </WeatherProvider>
            </BlockageProvider>
        </WebSocketProvider>
    );
}

function Header({ locationName }: { locationName: string }) {
    return (
        <header className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 px-4 py-3 sticky top-0 z-30">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                    <h1 className="text-xl font-bold text-primary dark:text-white">AGOS</h1>
                    <span className="text-gray-400 dark:text-slate-700">|</span>
                    <span className="text-sm text-gray-500 dark:text-slate-400 font-medium">
                        {locationName}
                    </span>
                </Link>
                <Link
                    to="/auth/login"
                    className="flex items-center gap-1.5 text-sm text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 transition-colors font-medium"
                >
                    <LogIn className="w-4 h-4" />
                    <span>Admin Access</span>
                </Link>
            </div>
        </header>
    );
}

import PublicInsights from "./components/PublicInsights";

function StatusCards() {
    return (  
        <div className="flex flex-col gap-4">
            <FusionAnalysis />
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 h-full">
                <BlockageStatusCard />
                <WeatherConditionCard />
                <WaterLevelStatusCard />
            </div>
            <PublicInsights />
        </div>
    );
}
