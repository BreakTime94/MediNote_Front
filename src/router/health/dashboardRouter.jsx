import React, { lazy } from "react";
import ProtectedRoute from "@/router/protector/ProtectionRoute.jsx";

const MainDashboard = lazy(() => import("@/pages/health/MainDashboard.jsx"));

const dashboardRouter = [
  {
    element: <ProtectedRoute />,
    children: [
      { path: "/dashboard", element: <MainDashboard /> },
    ],
  },
];

export default dashboardRouter;
