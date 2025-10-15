import { lazy } from "react";

// Lazy load
const QnAPage = lazy(() => import("@/pages/qna/QnAPage.jsx"));
const FaqPage = lazy(() => import("@/pages/faq/FaqPage.jsx"));
const NotifyPage = lazy(() => import("@/pages/notify/NotifyPage.jsx"));

/**
 * 게시판(boards) 라우터
 * - /boards/qna : QnA 리스트
 * - /boards/faq : FAQ 리스트
 * - 추후 /boards/notice 등 확장 가능
 */
const BoardRouter = [
    {
        path: "/boards",
        children: [
            // Boards 홈(임시)
            { index: true, element: <div>Boards Home</div> },

            // QnA 리스트
            { path: "qna", element: <QnAPage /> },

            // ✅ FAQ 리스트
            { path: "faq", element: <FaqPage /> },

            { path: "notice", element: <NotifyPage /> },

            // 추후 추가 예정
            // { path: "qna/read/:id", element: <QnAReadPage /> },
            // { path: "qna/write", element: <QnAWritePage /> },
        ],
    },
];

export default BoardRouter;
