import { NavLink } from "react-router-dom";
import clsx from "clsx";

/**
 * props:
 *  - items: navData 배열
 *  - align: "left" | "center" | "right"
 *  - dropdownCols: 1|2|3|4 (드롭다운 컬럼 수)
 *  - className, gap: 추가 스타일
 */
function NavBar(props) {
    // ✅ 함수 내부에서 매개변수 분류 + 기본값
    const {
        items = [],
        align = "left",
        dropdownCols = 3,
        className = "",
        gap = "gap-10",
    } = props;

    const navClass = clsx(
        "flex items-center",
        gap,
        {
            "justify-start": align === "left",
            "justify-center": align === "center",
            "justify-end": align === "right",
        },
        className
    );

    // Tailwind가 인식할 수 있도록 리터럴로 나열
    const dropdownGridClass = clsx(
        "grid grid-cols-1 gap-2",
        {
            "sm:grid-cols-1": dropdownCols === 1,
            "sm:grid-cols-2": dropdownCols === 2,
            "sm:grid-cols-3": dropdownCols === 3,
            "sm:grid-cols-4": dropdownCols === 4,
        }
    );

    return (
        <nav className={navClass}>
            {items.map((item) => (
                <NavItem key={item.path ?? item.label} item={item} dropdownGridClass={dropdownGridClass} />
            ))}
        </nav>
    );
}

function NavItem({ item, dropdownGridClass }) {
    // ✅ 하위 아이템도 분류
    const {
        label,
        path = "#",
        children = [],
        icon: Icon,         // navData에 Icon을 주입하면 사용
        disabled = false,
        target,
        rel,
    } = item;

    const parentClass = ({ isActive }) =>
        clsx(
            "px-2 py-3 text-sm transition-colors",
            disabled && "pointer-events-none opacity-50",
            isActive ? "text-black" : "text-gray-600 hover:text-gray-900"
        );

    const isDropdown = children.length > 0 && !disabled;

    return (
        <div className="relative group">
            <NavLink to={path} className={parentClass} target={target} rel={rel}>
                {Icon ? <Icon className="mr-1 inline-block align-[-2px]" size={16} /> : null}
                {label}
            </NavLink>

            {isDropdown && (
                <div className="absolute left-0 z-50 hidden group-hover:block mt-2 min-w-64 rounded-xl border border-gray-200 bg-white p-4 shadow-lg focus-within:block">
                    <ul className={dropdownGridClass}>
                        {children.map((c) => {
                            const { label: cLabel, path: cPath = "#", target: cTarget, rel: cRel } = c;
                            return (
                                <li key={cPath}>
                                    <NavLink
                                        to={cPath}
                                        target={cTarget}
                                        rel={cRel}
                                        className={({ isActive }) =>
                                            clsx(
                                                "block rounded-lg px-4 py-2 text-sm",
                                                isActive ? "bg-gray-100 text-gray-900" : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                                            )
                                        }
                                    >
                                        {cLabel}
                                    </NavLink>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default NavBar;