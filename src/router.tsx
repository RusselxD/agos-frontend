import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";

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
        ],
    },
    {
        path: "/",
        element: <Navigate to="admin" replace />,
    },
]);
