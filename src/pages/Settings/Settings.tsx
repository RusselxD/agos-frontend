import { useEffect, useState } from "react";
import { LogOut, Moon, Sun } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import DataRetention from "./components/DataRetention";
import SensorConfiguration from "./components/SensorConfiguration/SensorConfiguration";
import { SensorConfigurationProvider } from "./components/SensorConfiguration/CalibrationCardContext";
import Container from "../../components/ui/Container";
import { useAuth } from "../../context/AuthContext";

export default function Settings() {
    const { logout } = useAuth();
    const { mode, setMode } = useTheme();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const toggleTheme = () => {
        setMode(mode === "dark" ? "light" : "dark");
    };

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
                <div className="space-y-4 divide-y divide-gray-100 dark:divide-slate-700">
                    <div className="flex items-center justify-between pt-1">
                        <div>
                            <p className="text-sm font-medium text-gray-700 dark:text-slate-200">Appearance</p>
                            <p className="text-xs text-gray-500 dark:text-slate-400">Switch between light and dark mode</p>
                        </div>
                        <button
                            onClick={toggleTheme}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                        >
                            {mode === "dark" ? (
                                <>
                                    <Sun size={16} />
                                    Light Mode
                                </>
                            ) : (
                                <>
                                    <Moon size={16} />
                                    Dark Mode
                                </>
                            )}
                        </button>
                    </div>

                    <div className="flex items-center justify-between pt-4">
                        <div>
                            <p className="text-sm font-medium text-gray-700 dark:text-slate-200">Sign out</p>
                            <p className="text-xs text-gray-500 dark:text-slate-400">End your current session</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 border border-red-300 dark:border-red-800/50 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 disabled:opacity-50 transition-colors"
                        >
                            <LogOut size={16} />
                            {isLoggingOut ? "Signing out..." : "Sign out"}
                        </button>
                    </div>
                </div>
            </Container>
        </div>
    );
}
