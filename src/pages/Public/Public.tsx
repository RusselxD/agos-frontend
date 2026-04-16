import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
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
    const { isAuthenticated, isAuthChecking } = useAuth();
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
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="spinner w-6 h-6" />
            </div>
        );
    }

    if (isAuthenticated) {
        return <Navigate to="/admin" replace />;
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <p className="text-gray-500">{error}</p>
            </div>
        );
    }

    if (!location || !location.location_id) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="spinner w-6 h-6" />
            </div>
        );
    }

    return (
        <WebSocketProvider locationId={location.location_id}>
            <BlockageProvider>
                <WeatherProvider>
                    <WaterLevelProvider locationId={location.location_id}>
                        <FusionAnalysisProvider isPublic>
                            <div className="min-h-screen bg-gray-50">
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
        <header className="bg-white border-b border-gray-200 px-4 py-3">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <h1 className="text-xl font-bold text-primary">AGOS</h1>
                    <span className="text-gray-400">|</span>
                    <span className="text-sm text-gray-500">
                        {locationName}
                    </span>
                </div>
                <Link
                    to="/auth/login"
                    className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <LogIn className="w-4 h-4" />
                    <span>Admin</span>
                </Link>
            </div>
        </header>
    );
}

function StatusCards() {
    return (
        <div className="flex flex-col gap-4">
            <FusionAnalysis />
            <div className="grid grid-cols-3 gap-4">
                <BlockageStatusCard />
                <WeatherConditionCard />
                <WaterLevelStatusCard />
            </div>
        </div>
    );
}
