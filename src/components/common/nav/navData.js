export const NavData = [
    {
        label: "소개",
        path: "/coming-soon",
        children: [
            { label: "프로젝트 소개", path: "/coming-soon" },
            { label: "철학 & 가치", path: "/coming-soon" },
            { label: "팀 소개", path: "/coming-soon" },
        ],
    },
    {
        label: "마이케어",
        path: "/mycare",
        children: [
            { label: "건강정보 등록", path: "/mycare/register" },
            { label: "건강정보 조회", path: "/mycare/list" },
            { label: "건강정보 차트", path: "/mycare/chart" },
        ],
    },
    {
        label: "헬스인사이트",
        path: "/news",
        children: [
            { label: "뉴스",     path: "/news" },
            { label: "칼럼",     path: "/columns" },
            { label: "건강정보", path: "/health-info" },
        ],
    },
    {
        label: "헬스파인더",
        path: "/coming-soon",
        children: [
            { label: "건강검진", path: "/coming-soon" },
            { label: "예방접종", path: "/coming-soon" },
            { label: "운동 프로그램", path: "/coming-soon" },
        ],
    },
    {
        label: "내주변 병원",
        path: "/map",
    },
    {
        label: "고객지원",
        path: "/boards/notice",
        children: [
            { label: "공지사항", path: "/boards/notice" },
            { label: "자주 묻는 질문(FAQ)", path: "/boards/faq" },
            { label: "질문답변(QnA)", path: "/boards/qna" },
        ],
    },

];