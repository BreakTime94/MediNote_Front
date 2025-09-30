import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "../ui/button/Button.jsx"; // 프로젝트 경로에 맞게 조정

/**
 * 재사용 가능한 AsideNav
 *
 * props
 * - title?: string                      // 상단 타이틀
 * - subtitle?: string                   // 상단 서브타이틀
 * - items: { id: string, label: string, icon?: ReactNode }[]
 * - className?: string                  // 컨테이너 추가 클래스
 * - sticky?: { enabled?: boolean, top?: number, width?: number }  // sticky 제어
 * - scroll: {
 *     offset?: number,                  // 고정 헤더 높이 등 보정(px)
 *     smooth?: boolean,                 // 스무스 스크롤 여부
 *     spy?: boolean,                    // 스크롤 스파이 활성화
 *     syncHash?: boolean,               // URL #hash 동기화
 *   }
 * - ui?: {
 *     activeGradientClass?: string,     // 활성 버튼 배경 그라데이션 클래스
 *     inactiveHoverClass?: string,      // 비활성 호버 클래스
 *     buttonHeightClass?: string,       // 버튼 높이 클래스
 *   }
 * - activeId?: string                   // 외부 제어형 active id (controlled)
 * - defaultActiveId?: string            // 내부 상태 초기값 (uncontrolled)
 * - onChange?: (id: string) => void     // 활성 항목 변경 시 콜백
 */

export default function AsideNav({
                                     title = "",
                                     subtitle = "",
                                     items,
                                     className = "",
                                     sticky = { enabled: true, top: 96, width: 260 },
                                     scroll = { offset: 80, smooth: true, spy: true, syncHash: false },
                                     ui = {
                                         activeGradientClass: "bg-grad-main", // 전역 그라데이션 유틸이 있다면 사용
                                         inactiveHoverClass: "hover:bg-gray-50",
                                         buttonHeightClass: "h-11",
                                     },
                                     activeId,
                                     defaultActiveId,
                                     onChange,
                                 }) {
    // 내부/외부 제어 모두 지원
    const [innerActive, setInnerActive] = useState(
        defaultActiveId ?? items?.[0]?.id ?? ""
    );
    const isControlled = typeof activeId === "string";
    const currentActive = isControlled ? activeId : innerActive;

    const setActive = (id) => {
        if (!isControlled) setInnerActive(id);
        onChange?.(id);
    };

    const offset = scroll?.offset ?? 80;
    const smooth = scroll?.smooth ?? true;
    const spy = scroll?.spy ?? true;
    const syncHash = scroll?.syncHash ?? false;

    // Observe 대상 섹션 수집
    const sectionEls = useMemo(
        () =>
            (items || [])
                .map((it) => document.getElementById(it.id))
                .filter(Boolean),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [JSON.stringify(items)]
    );

    // ScrollSpy
    const observersRef = useRef([]);
    useEffect(() => {
        if (!spy) return;

        observersRef.current.forEach((obs) => obs.disconnect());
        observersRef.current = [];

        if (!sectionEls.length) return;

        const handleIntersect = (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    setActive(id);
                    if (syncHash) {
                        history.replaceState(null, "", `#${id}`);
                    }
                }
            });
        };

        const observer = new IntersectionObserver(handleIntersect, {
            root: null,
            threshold: 0.1,
            rootMargin: `-${offset + 6}px 0px -60% 0px`,
        });

        sectionEls.forEach((el) => observer.observe(el));
        observersRef.current.push(observer);

        return () => observersRef.current.forEach((obs) => obs.disconnect());
    }, [spy, sectionEls, offset, syncHash]); // deps

    // 클릭 → 해당 섹션으로 스크롤
    const scrollToId = (id) => {
        const el = document.getElementById(id);
        if (!el) return;

        const top =
            window.scrollY + el.getBoundingClientRect().top - Math.max(0, offset);

        window.scrollTo({ top, behavior: smooth ? "smooth" : "auto" });
        setActive(id);
        if (syncHash) history.replaceState(null, "", `#${id}`);

        // 접근성: 포커스 이동
        setTimeout(() => el.setAttribute("tabindex", "-1") || el.focus(), 300);
    };

    // sticky 클래스 구성
    const stickyCls =
        sticky?.enabled !== false
            ? `md:sticky md:top-[${(sticky?.top ?? 96)}px] md:self-start md:w-[${(sticky?.width ?? 260)}px]`
            : "";

    return (
        <aside
            className={
                `${stickyCls} w-full rounded-2xl border bg-white p-3 shadow-sm ` +
                className
            }
            role="navigation"
            aria-label={title || "사이드 네비게이션"}
        >
            {(title || subtitle) && (
                <header className="px-3 pt-1 pb-2">
                    {title && (
                        <h3 className="text-base font-semibold text-gray-800">{title}</h3>
                    )}
                    {subtitle && (
                        <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
                    )}
                </header>
            )}

            <nav className="flex flex-col gap-2">
                {items.map((it) => {
                    const isActive = currentActive === it.id;

                    // 버튼 공통 클래스(얇은 테두리 & 좌측 정렬)
                    const common =
                        `justify-start ${ui.buttonHeightClass || "h-11"} border `;

                    // 상태별 클래스
                    const activeCls = `${ui.activeGradientClass || "bg-grad-main"} text-white border-white/40 shadow-sm`;
                    const inactiveCls = `text-gray-700 border-gray-200 ${ui.inactiveHoverClass || "hover:bg-gray-50"}`;

                    return (
                        <Button
                            key={it.id}
                            onClick={() => scrollToId(it.id)}
                            variant={isActive ? "gradient" : "white"}
                            radius="lg"
                            size="md"
                            fullWidth
                            aria-current={isActive ? "true" : "false"}
                            className={`${common} ${isActive ? activeCls : inactiveCls}`}
                        >
              <span className="inline-flex items-center gap-2">
                {it.icon}
                  {it.label}
              </span>
                        </Button>
                    );
                })}
            </nav>
        </aside>
    );
}