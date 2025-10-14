// import React, { lazy } from "react";
// import ProtectedRoute from "@/router/protector/ProtectionRoute.jsx";
//
// // 페이지 컴포넌트 Lazy 로드
// const MyPage = lazy(() => import("@/pages/member/MyPage.jsx"));
// const Measurement = lazy(() => import("@/pages/health/Measurement.jsx"));
// const MeasurementList = lazy(() => import("@/pages/health/MeasurementList.jsx"));
// const MeasurementChart = lazy(() => import("@/pages/health/MeasurementChart.jsx"));
//
// // ---------------------------------------------------
// // MyCare 전용 라우팅 설정
// // ---------------------------------------------------
// const mycareRouter = [
//   {
//     element: <ProtectedRoute />, // 로그인 필수 라우팅 보호
//     children: [
//
//       // 프로필 / 측정 관련
//       { path: "mycare/mypage", element: <MyPage /> },
//       { path: "mycare/measurement", element: <Measurement /> },
//       { path: "mycare/measurementList", element: <MeasurementList /> },
//       { path: "mycare/measurementChart", element: <MeasurementChart /> },
//     ],
//   },
// ];
//
// export default mycareRouter;
