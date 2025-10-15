export const AdminNavData = [
    {
        label: "멤버조회",
        path: "/admin/main/member",
        children: [
            { label: "프로젝트 소개", path: "/about/project" },
            { label: "철학 & 가치", path: "/about/philosophy" },
            { label: "팀 소개", path: "/about/team" },
        ],
    },
    {
        label: "게시판 관리",
        path: "/admin/main/board",
        children: [
            { label: "건강정보 등록", path: "/mycare/dashboard" },
            { label: "건강정보 조회", path: "/mycare/meds" },
            { label: "건강정보 차트", path: "/mycare/vitals" },
        ],
    },



];