import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import AlertLogs from "./pages/AlertLogs";
import Calibration from "./pages/Calibration";
import Settings from "./pages/Settings";
import Responders from "./pages/Responders";

export const router = createBrowserRouter([
    {
        path: "admin",
        element: <MainLayout />,
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
                path: "calibration",
                element: <Calibration />,
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
