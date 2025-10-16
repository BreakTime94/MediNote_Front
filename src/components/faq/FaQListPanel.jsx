import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../common/api/axiosInterceptor.js";
import { getCategoryName } from "../common/constants/boardCategory.js"; // ✅ 추가

/**
 * FaqListPanel - FAQ 게시판 목록 컴포넌트
 *
 * props
 * - initialKeyword?: string
 * - pageSizeOptions?: number[]      (기본: [5, 10, 20])
 * - defaultSize?: number            (기본: 10)
 * - showWriteButton?: boolean       (기본: true)
 * - onWrite?: () => void            (기본: /faq/write 로 이동)
 * - onRead?: (id: number) => void   (기본: /faq/read/:id 로 이동)
 * - adminMode?: boolean             (관리자 수정/삭제 버튼 노출 여부)
 */
export default function FaqListPanel({
                                         initialKeyword = "",
                                         pageSizeOptions = [5, 10, 20],
                                         defaultSize = 10,
                                         showWriteButton = true,
                                         onWrite,
                                         onRead,
                                         adminMode = false,
                                     }) {
    const navigate = useNavigate();

    // 상태 관리
    const [keyword, setKeyword] = useState(initialKeyword);
    const [size, setSize] = useState(defaultSize);
    const [page, setPage] = useState(1);

    const [items, setItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const totalPages = useMemo(() => Math.max(1, Math.ceil(total / size)), [total, size]);

    // 네비게이션 콜백
    const goWrite = () => (onWrite ? onWrite() : navigate("/faq/write"));
    const goRead = (id) => (onRead ? onRead(id) : navigate(`/faq/read/${id}`));

    // 날짜 포맷
    const fmtDate = (iso) => {
        if (!iso) return "-";
        const d = new Date(iso);
        if (Number.isNaN(d.getTime())) return "-";
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
            d.getDate()
        ).padStart(2, "0")}`;
    };

    // ✅ 데이터 조회 + 카테고리명 변환
    const fetchData = async (nextPage = 1) => {
        setLoading(true);
        setError("");
        try {
            const body = {
                cond: {
                    keyword: keyword?.trim() || null,
                },
                criteria: { page: nextPage, size },
            };
            const res = await api.post("/boards/faq/list", body);

            // ✅ boardCategoryId → boardCategoryName 변환 추가
            const mapped = (res.data?.items || []).map((item) => ({
                ...item,
                boardCategoryName: getCategoryName(item.boardCategoryId, true),
            }));

            setItems(mapped);
            setTotal(res.data?.page?.totalElements ?? res.data?.totalElements ?? 0);
            setPage(nextPage);
        } catch (e) {
            console.error("FAQ 목록 조회 실패:", e);
            setError("FAQ 목록을 불러오지 못했습니다.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [size]);

    const onSubmit = (e) => {
        e.preventDefault();
        fetchData(1);
    };

    return (
        <section className="w-full max-w-5xl mx-auto">
            {/* 헤더 */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-semibold text-gray-900">FAQ</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        자주 묻는 질문을 검색하거나 새로운 항목을 등록해보세요.
                    </p>
                </div>
                {showWriteButton && (
                    <button
                        onClick={goWrite}
                        className="rounded-2xl px-4 py-2 shadow-sm text-white bg-gradient-to-r from-pink-300 to-purple-300 hover:opacity-90 transition"
                    >
                        FAQ 등록
                    </button>
                )}
            </div>

            {/* 검색/필터 */}
            <div className="rounded-3xl border border-gray-200 bg-white p-4 md:p-5 shadow-sm mb-6">
                <div className="flex flex-wrap items-center gap-2 md:gap-3">
                    <div className="ms-auto" />

                    <select
                        className="rounded-xl border-gray-200 text-sm"
                        value={size}
                        onChange={(e) => setSize(Number(e.target.value))}
                    >
                        {pageSizeOptions.map((n) => (
                            <option key={n} value={n}>
                                {n}개씩
                            </option>
                        ))}
                    </select>

                    <form onSubmit={onSubmit} className="flex items-stretch gap-2">
                        <input
                            type="text"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            placeholder="FAQ 검색 (예: 로그인, 비밀번호, 오류...)"
                            className="rounded-xl border border-gray-200 text-sm px-3 py-2 w-56 focus:outline-none focus:ring-2 focus:ring-purple-200"
                        />
                        <button
                            type="submit"
                            className="rounded-2xl px-4 py-2 text-sm text-white bg-gradient-to-r from-pink-300 to-purple-300 hover:opacity-90 transition"
                        >
                            검색
                        </button>
                    </form>
                </div>
            </div>

            {/* 리스트 */}
            <div className="rounded-3xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                <div className="grid grid-cols-12 gap-2 px-4 md:px-6 py-3 text-xs md:text-sm text-gray-500 bg-gray-50">
                    <div className="col-span-8 md:col-span-8">제목</div>
                    <div className="hidden md:block md:col-span-2 text-center">작성일</div>
                    <div className="hidden md:block md:col-span-2 text-center">공개여부</div>
                </div>

                {loading ? (
                    <div className="p-8 text-center text-gray-500">불러오는 중…</div>
                ) : error ? (
                    <div className="p-8 text-center text-red-500">{error}</div>
                ) : items.length === 0 ? (
                    <div className="p-10 text-center text-gray-500">표시할 FAQ가 없습니다.</div>
                ) : (
                    <ul className="divide-y divide-gray-100">
                        {items.map((faq) => (
                            <li key={faq.id} className="grid grid-cols-12 gap-2 px-4 md:px-6 py-4">
                                <div className="col-span-12 md:col-span-8">
                                    <button
                                        onClick={() => goRead(faq.id)}
                                        className="text-left text-gray-900 hover:underline"
                                        title={faq.title}
                                    >
                                        <span className="font-medium">{faq.title}</span>
                                    </button>

                                    {/* ✅ 카테고리 이름 표시 */}
                                    {faq.boardCategoryName && (
                                        <div className="mt-1 flex flex-wrap items-center gap-1.5">
                      <span className="text-[11px] md:text-xs px-2 py-0.5 rounded-full bg-gray-50 ring-1 ring-gray-200 text-gray-600">
                        {faq.boardCategoryName}
                      </span>
                                        </div>
                                    )}

                                    <div className="mt-1 md:hidden text-xs text-gray-500">
                                        {fmtDate(faq.regDate)} · {faq.isPublic === false ? "비공개" : "공개"}
                                    </div>
                                </div>

                                <div className="hidden md:flex md:col-span-2 items-center justify-center text-sm text-gray-600">
                                    {fmtDate(faq.regDate)}
                                </div>

                                <div className="hidden md:flex md:col-span-2 items-center justify-center text-sm text-gray-600">
                                    {faq.isPublic === false ? "비공개" : "공개"}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}

                {/* 페이지네이션 */}
                <div className="flex items-center justify-center gap-1 p-4">
                    <button
                        onClick={() => page > 1 && fetchData(page - 1)}
                        className="px-3 py-1.5 text-sm rounded-lg ring-1 ring-gray-200 hover:bg-gray-50 disabled:opacity-40"
                        disabled={page <= 1}
                    >
                        이전
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <button
                            key={p}
                            onClick={() => fetchData(p)}
                            className={
                                "px-3 py-1.5 text-sm rounded-lg ring-1 " +
                                (p === page
                                    ? "bg-gray-900 text-white ring-gray-900"
                                    : "ring-gray-200 hover:bg-gray-50")
                            }
                        >
                            {p}
                        </button>
                    ))}
                    <button
                        onClick={() => page < totalPages && fetchData(page + 1)}
                        className="px-3 py-1.5 text-sm rounded-lg ring-1 ring-gray-200 hover:bg-gray-50 disabled:opacity-40"
                        disabled={page >= totalPages}
                    >
                        다음
                    </button>
                </div>
            </div>
        </section>
    );
}
