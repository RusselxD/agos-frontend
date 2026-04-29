import { useEffect, useState } from "react";
import { LogOut } from "lucide-react";
import DataRetention from "./components/DataRetention";
import SensorConfiguration from "./components/SensorConfiguration/SensorConfiguration";
import { SensorConfigurationProvider } from "./components/SensorConfiguration/CalibrationCardContext";
import Container from "../../components/ui/Container";
import { useAuth } from "../../context/AuthContext";

export default function Settings() {
    const { logout } = useAuth();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    useEffect(() => {
        document.title = "Settings - AGOS";

        return () => {
            document.title = "AGOS";
        };
    }, []);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        await logout();
    };

    return (
        <div className="space-y-2">
            <DataRetention />

            <SensorConfigurationProvider>
                <SensorConfiguration />
            </SensorConfigurationProvider>

            <Container headerTitle="ACCOUNT">
                <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-700">Sign out</p>
                        <p className="text-xs text-gray-500">End your current session</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="flex shrink-0 items-center gap-2 rounded-lg border border-red-300 px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50 sm:px-4"
                    >
                        <LogOut size={16} />
                        {isLoggingOut ? "Signing out..." : "Sign out"}
                    </button>
                </div>
            </Container>
        </div>
    );
}
