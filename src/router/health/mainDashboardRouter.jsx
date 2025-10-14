import React, { lazy } from "react";
import ProtectedRoute from "@/router/protector/ProtectionRoute.jsx";

const MainDashboard = lazy(() => import("@/pages/health/MainDashboard.jsx"));

const dashboardRouter = [
  {
    path: "/",            // 메인 페이지 주소
    element: <MainDashboard />,
  },
];

export default dashboardRouter;
