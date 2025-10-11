import Profile from "@/pages/member/Profile.jsx";
import ChangePassword from "@/pages/member/ChangePassword.jsx";
import AsideNav from "@/components/common/nav/AsideNav.jsx";
import {useAsideNav} from "@/components/common/hooks/useAsideNav.jsx";

export default function MyPage() {
  const navItems = [
    { id: "profile", label: "프로필 정보", actionType: "component"},
    { id: "change-password", label: "비밀번호 변경", actionType: "component"},
  ];

  const componentMap = {
    "profile": Profile,
    "change-password": ChangePassword,
  }
  const {
    activeId,
    ActiveComponent,
    isComponentMode,
    handleAction,
    handleChange,
  } = useAsideNav({
    items: navItems,
    componentMap,
    defaultActiveId: "profile",
    scrollOffset: 100,
  });

  return(
      <div className="flex justify-center bg-gray-50 py-10 min-h-screen">
        <div className="grid grid-cols-[260px_1fr] gap-6 max-w-6xl w-full">
          {/* 왼쪽 네비 */}
          <AsideNav
              title="마이페이지"
              subtitle="내 정보 관리"
              items={navItems}
              sticky={{ enabled: true, top: 24, width: 260 }}
              scroll={{ offset: 100, smooth: true, spy: true }}
              ui={{
                activeGradientClass: "bg-gradient-to-r from-pink-400 to-purple-400",
                inactiveHoverClass: "hover:bg-purple-50",
                buttonHeightClass: "h-11",
              }}
              activeId={activeId}
              onChange={handleChange}
              onAction={handleAction}
          />

          {/* 오른쪽 내용 */}
          <main className="bg-white border rounded-2xl shadow-sm p-8">
            {ActiveComponent ? (
                <ActiveComponent />
            ) : (
                <p className="text-gray-500">메뉴를 선택하세요.</p>
            )}
          </main>
        </div>
      </div>
  )
}