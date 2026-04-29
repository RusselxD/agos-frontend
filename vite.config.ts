import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (!id.includes("node_modules")) return;

                    if (id.includes("/react/") || id.includes("/react-dom/")) {
                        return "react";
                    }

                    if (id.includes("/react-router-dom/") || id.includes("/@remix-run/")) {
                        return "router";
                    }

                    if (id.includes("/chart.js/") || id.includes("/react-chartjs-2/")) {
                        return "charts";
                    }

                    if (id.includes("/exceljs/")) {
                        return "exceljs";
                    }

                    if (id.includes("/xlsx/")) {
                        return "xlsx";
                    }

                    if (id.includes("/lucide-react/")) {
                        return "icons";
                    }

                    if (
                        id.includes("/axios/") ||
                        id.includes("/date-fns/") ||
                        id.includes("/papaparse/") ||
                        id.includes("/react-toastify/")
                    ) {
                        return "utils";
                    }
                },
            },
        },
    },
    plugins: [
        react(),
        VitePWA({
            registerType: "autoUpdate",
            devOptions: {
                enabled: true,
            },
            workbox: {
                maximumFileSizeToCacheInBytes: 3 * 1024 * 1024, // 3 MiB
                globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
            },
            manifest: {
                name: "AGOS",
                short_name: "AGOS",
                display: "standalone",
                background_color: "#ffffff",
                theme_color: "#ffffff",
                icons: [
                    {
                        src: "/agos.png",
                        sizes: "1000x1000",
                        type: "image/png",
                    },
                ],
            },
        }),
    ],
});
