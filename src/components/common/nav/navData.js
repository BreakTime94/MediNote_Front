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
            { label: "대시보드", path: "/mycare/dashboard" },
            { label: "복약 관리", path: "/mycare/meds" },
            { label: "바이탈 로그", path: "/mycare/vitals" },
        ],
    },
    {
        label: "헬스인사이트",
        path: "/insight",
        children: [
            { label: "뉴스", path: "/insight/news" },
            { label: "칼럼", path: "/insight/column" },
            { label: "생활 팁", path: "/insight/tips" },
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
        path: "/nearby",
        children: [
            { label: "내과", path: "/nearby/internal" },
            { label: "정형외과", path: "/nearby/ortho" },
            { label: "치과", path: "/nearby/dental" },
        ],
    },
    {
        label: "커뮤니티",
        path: "/community",
        children: [
            { label: "자유게시판", path: "/community/free" },
            { label: "질문답변", path: "/community/qna" },
            { label: "건강후기", path: "/community/reviews" },
            { label: "챌린지", path: "/community/challenges" },
            { label: "모임", path: "/community/meetups" },
            { label: "전문가 상담", path: "/community/expert" },
        ],
    },

];