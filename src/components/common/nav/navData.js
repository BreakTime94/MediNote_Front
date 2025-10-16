export const NavData = [
    {
        label: "소개",
        path: "/about",
        children: [
            { label: "프로젝트 소개", path: "/about/project" },
            { label: "철학 & 가치", path: "/about/philosophy" },
            { label: "팀 소개", path: "/about/team" },
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
        path: "/finder",
        children: [
            { label: "건강검진", path: "/finder/checkup" },
            { label: "예방접종", path: "/finder/vaccine" },
            { label: "운동 프로그램", path: "/finder/programs" },
        ],
    },
    {
        label: "내주변 병원",
        path: "/map",
        children: [
            { label: "내과", path: "/nearby/internal" },
            { label: "정형외과", path: "/nearby/ortho" },
            { label: "치과", path: "/nearby/dental" },
        ],
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