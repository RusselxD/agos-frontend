import { createBrowserRouter, Navigate } from "react-router-dom";
import ErrorBoundary from "./components/common/ErrorBoundary";

import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import Dashboard from "./pages/Dashboard";
import Sensor from "./pages/Sensor";
import Settings from "./pages/Settings";
import Responders from "./pages/Responders";
import ProtectedRoute from "./guards/ProtectedRoute";
import Public from "./pages/Public";
import Landing from "./pages/Landing";

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
import { AdminsPageProvider } from "./pages/Admins/context/AdminsPageContext";
import { CoreProvider } from "./context/CoreContext";
import Weather from "./pages/Weather/Weather";
import ReadingLogs from "./pages/ReadingLogs";
import NotificationLogs from "./pages/NotificationLogs";
import DetectionLogs from "./pages/DetectionLogs";

export const router = createBrowserRouter([
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
        element: <ErrorBoundary><Dashboard /></ErrorBoundary>,
      },
      {
        path: "weather",
        element: <ErrorBoundary><Weather /></ErrorBoundary>,
      },
      {
        path: "sensor",
        element: <ErrorBoundary><Sensor /></ErrorBoundary>,
      },
      {
        path: "responders",
        element: <ErrorBoundary><Responders /></ErrorBoundary>,
      },
      {
        path: "reading-logs",
        element: <ErrorBoundary><ReadingLogs /></ErrorBoundary>,
      },
      {
        path: "notification-logs",
        element: <ErrorBoundary><NotificationLogs /></ErrorBoundary>,
      },
      {
        path: "detection-logs",
        element: <ErrorBoundary><DetectionLogs /></ErrorBoundary>,
      },
      {
        path: "admins",
        element: (
          <ErrorBoundary>
            <AdminsPageProvider>
              <Admins />
            </AdminsPageProvider>
          </ErrorBoundary>
        ),
      },
      {
        path: "settings",
        element: <ErrorBoundary><Settings /></ErrorBoundary>,
      },
    ],
  },
  {
    path: "/",
    element: <ErrorBoundary><Landing /></ErrorBoundary>,
  },
  {
    path: "/public",
    element: <ErrorBoundary><Public /></ErrorBoundary>,
  },
]);
