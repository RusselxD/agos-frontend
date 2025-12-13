import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import AlertLogs from "./pages/AlertLogs";
import Sensor from "./pages/Sensor";
import Settings from "./pages/Settings";
import Responders from "./pages/Responders";
import { WeatherProvider } from "./context/WeatherContext";
import { WaterLevelProvider } from "./context/WaterLevelContext";
import { BlockageProvider } from "./context/BlockageContext";
import { FusionAnalysisProvider } from "./context/FusionAnalysisContext";
import { VideoProvider } from "./context/VideoContext";
import AuthLayout from "./layouts/AuthLayout";
import Login from "./pages/Login";

export const router = createBrowserRouter([
    {
        path: "login",
        element: <AuthLayout />,
        children: [
            {
                index: true,
                element: <Login/>
            },
        ],
    },
    {
        path: "admin",
        element: (
            // BlockageProvider = for blockage detection AI status
            // WeatherProvider = for weather condition data
            // WaterLevelProvider = for water level sensor data
            //
            // FusionAnalysisProvider = for fusion analysis data
            <BlockageProvider>
                <VideoProvider>
                    <WeatherProvider>
                        <WaterLevelProvider>
                            <FusionAnalysisProvider>
                                <MainLayout />
                            </FusionAnalysisProvider>
                        </WaterLevelProvider>
                    </WeatherProvider>
                </VideoProvider>
            </BlockageProvider>
        ),
        children: [
            {
                index: true,
                element: <Navigate to="dashboard" replace />,
            },
            {
                path: "dashboard",
                element: <Dashboard />,
            },
            {
                path: "alert-logs",
                element: <AlertLogs />,
            },
            {
                path: "sensor",
                element: <Sensor />,
            },
            {
                path: "settings",
                element: <Settings />,
            },
            {
                path: "responders",
                element: <Responders />,
            },
        ],
    },
    {
        path: "/",
        element: <Navigate to="admin" replace />,
    },
]);
