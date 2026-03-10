import { createBrowserRouter, Navigate } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import Dashboard from "./pages/Dashboard";
import Sensor from "./pages/Sensor";
import Settings from "./pages/Settings";
import Responders from "./pages/Responders";
import ProtectedRoute from "./guards/ProtectedRoute";

import Admins from "./pages/Admins";
import Login from "./pages/Login";
import ForcePasswordChange from "./pages/ForcePasswordChange";

// import Register from "./pages/RespondersRegister/pages/Register";

import { WeatherProvider } from "./context/WeatherContext";
import { WaterLevelProvider } from "./context/WaterLevelContext";
import { BlockageProvider } from "./context/BlockageContext";
import { FusionAnalysisProvider } from "./context/FusionAnalysisContext";
import { VideoProvider } from "./context/VideoContext";
import { WebSocketProvider } from "./context/WebSocketContext";
// import { RespondersRegisterProvider } from "./pages/RespondersRegister/context/RespondersRegisterContext";
// import VerifyOTP from "./pages/RespondersRegister/pages/VerifyOTP";
// import ResponderRegistrationGuard from "./guards/ResponderRegistrationGuard";
// import UploadID from "./pages/RespondersRegister/pages/UploadID";
// import RegistrationComplete from "./pages/RespondersRegister/pages/RegistrationComplete";
import { AdminsPageProvider } from "./pages/Admins/context/AdminsPageContext";
import { CoreProvider } from "./context/CoreContext";
import Weather from "./pages/Weather/Weather";
import ReadingLogs from "./pages/ReadingLogs";
import NotificationLogs from "./pages/NotificationLogs";

export const router = createBrowserRouter([
    // {
    //     path: "responder",
    //     element: (

    //             <AuthLayout />

    //     ),
    //     children: [
    //         {
    //             index: true,
    //             element: <Navigate to="register" replace />,
    //         },
    //         {
    //             path: "register",
    //             element: (
    //                 <ResponderRegistrationGuard>
    //                     <Register />
    //                 </ResponderRegistrationGuard>
    //             ),
    //         },
    //         {
    //             path: "verify-otp",
    //             element: (
    //                 <ResponderRegistrationGuard requireInitialData={true}>
    //                     <VerifyOTP />
    //                 </ResponderRegistrationGuard>
    //             ),
    //         },
    //         {
    //             path: "upload-id-photo",
    //             element: (
    //                 <ResponderRegistrationGuard requireOTPVerified={true}>
    //                     <UploadID />
    //                 </ResponderRegistrationGuard>
    //             ),
    //         },
    //         {
    //             path: "registration-complete",
    //             element: (
    //                 <ResponderRegistrationGuard
    //                     requireRegistrationCompleted={true}
    //                 >
    //                     <RegistrationComplete />
    //                 </ResponderRegistrationGuard>
    //             ),
    //         },
    //     ],
    // },
    {
        path: "auth",
        element: <AuthLayout />,
        children: [
            {
                index: true,
                element: <Navigate to="login" replace />,
            },
            {
                path: "login",
                element: <Login />,
            },
            {
                path: "force-password-change",
                element: <ForcePasswordChange />,
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
            //
            // WebSocketProvider = for websocket connection
            // LocationAndDevicesProvider = for location ID and device IDs
            <ProtectedRoute>
                <CoreProvider>
                    <WebSocketProvider>
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
                    </WebSocketProvider>
                </CoreProvider>
            </ProtectedRoute>
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
                path: "weather",
                element: <Weather />,
            },
            {
                path: "sensor",
                element: <Sensor />,
            },
            {
                path: "responders",
                element: <Responders />,
            },
            {
                path: "reading-logs",
                element: <ReadingLogs />,
            },
            {
                path: "notification-logs",
                element: <NotificationLogs />,
            },
            {
                path: "admins",
                element: (
                    <AdminsPageProvider>
                        <Admins />
                    </AdminsPageProvider>
                ),
            },
            {
                path: "settings",
                element: <Settings />,
            },
        ],
    },
    {
        path: "/",
        element: <Navigate to="admin" replace />,
    },
]);
