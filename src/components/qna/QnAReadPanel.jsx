// src/components/qna/QnAReadPanel.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../common/api/axiosInterceptor.js";
import { useAuthStore } from "@/components/common/hooks/useAuthStore.jsx";

export default function QnAReadPanel({
                                         onBack,
                                         onEdit,                 // 외부 페이지로의 이동을 쓰지 않고, 내부 인라인 수정 방식 사용
                                         showAdminActions = false, // 권한 제어는 나중에
                                     }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const { member } = useAuthStore();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");

    // 인라인 수정용 상태
    const [editMode, setEditMode] = useState(false);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [saving, setSaving] = useState(false);
    const [saveErr, setSaveErr] = useState("");

    const [deleting, setDeleting] = useState(false);

    const statusClass = useMemo(() => {
        if (!data) return "bg-gray-50 text-gray-700 ring-1 ring-gray-200";
        if (data.qnaStatus === "ANSWERED")
            return "bg-green-50 text-green-700 ring-1 ring-green-200";
        if (data.qnaStatus === "WAITING")
            return "bg-amber-50 text-amber-700 ring-1 ring-amber-200";
        return "bg-gray-50 text-gray-700 ring-1 ring-gray-200";
    }, [data]);

    const fmtDate = (iso) => {
        if (!iso) return "-";
        try {
            const d = new Date(iso);
            if (!isNaN(d.getTime())) {
                const pad = (n) => String(n).padStart(2, "0");
                return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
            }
        } catch (_) {}
        return String(iso).slice(0, 16).replace("T", " ");
    };

    const goBack = () => (onBack ? onBack() : navigate("/boards/qna"));

    const fetchDetail = async () => {
        setLoading(true);
        setErr("");
        try {
            const res = await api.get(`/boards/read/${id}`);
            setData(res.data || null);
            // 수정 모드 필드에 초기값 세팅
            setTitle(res.data?.title ?? "");
            setContent(res.data?.content ?? "");
        } catch (e) {
            console.error(e);
            setErr("글을 불러오지 못했습니다.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDetail();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    // ====== 수정 ======
    const handleEditToggle = () => {
        setSaveErr("");
        setEditMode((v) => !v);
        // 토글될 때 현재 본문을 다시 반영 (혹시 새로고침 후 값 바뀐 경우)
        if (data) {
            setTitle(data.title ?? "");
            setContent(data.content ?? "");
        }
    };

    const handleSave = async () => {
        setSaveErr("");
        if (!title?.trim() || title.trim().length < 2) {
            setSaveErr("제목은 2자 이상 입력하세요.");
            return;
        }
        if (!content?.trim() || content.trim().length < 10) {
            setSaveErr("내용은 10자 이상 입력하세요.");
            return;
        }

        setSaving(true);
        try {
            // BoardUpdateRequestDTO 순서: (id, boardCategoryId, title, content, isPublic, requireAdminPost, qnaStatus, postStatus)
            const dto = {
                id: Number(id),
                boardCategoryId: data?.boardCategoryId ?? null,
                title: title.trim(),
                content: content.trim(),
                isPublic: data?.isPublic ?? true,
                requireAdminPost: data?.requireAdminPost ?? false,
                qnaStatus: data?.qnaStatus ?? "WAITING",
                postStatus: data?.postStatus ?? "PUBLISHED",
            };
            await api.put(`/boards/update/${id}`, dto);
            // 저장 후 다시 상세 조회하고 수정 모드 종료
            await fetchDetail();
            setEditMode(false);
        } catch (e) {
            // 에러 내용을 콘솔에 자세히 출력(백엔드 메시지 확인)
                  console.error("PUT /boards/update error:", {
                        status: e?.response?.status,
                        data: e?.response?.data,
                        message: e?.message,
                      });
                  setSaveErr(
                      e?.response?.data?.message ??
                        e?.response?.data?.error ??
                        "수정에 실패했습니다. 잠시 후 다시 시도하세요."
                      );
        } finally {
            setSaving(false);
        }
    };

    // ====== 삭제 ======
    const handleDelete = async () => {
        if (!confirm("정말 삭제하시겠습니까? (소프트 삭제)")) return;
        setDeleting(true);
        try {
            const requesterId = member?.id ?? member?.memberId ?? 0;
            await api.delete(`/boards/delete/${id}`, {
                data: { requesterId, reason: "사용자 요청 삭제" },
            });
            alert("삭제되었습니다.");
            goBack();
        } catch (e) {
            console.error(e);
            alert("삭제에 실패했습니다.");
        } finally {
            setDeleting(false);
        }
    };

    return (
        <section className="w-full max-w-5xl mx-auto">
            {/* 헤더 */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-semibold text-gray-900">QnA</h2>
                    <p className="text-sm text-gray-500 mt-1">질문 상세</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={goBack}
                        className="rounded-2xl px-4 py-2 shadow-sm ring-1 ring-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition"
                    >
                        목록
                    </button>

                    {/* 수정/삭제 버튼: 우선 기능만 노출 (권한 제어는 추후) */}
                    {!editMode ? (
                        <button
                            onClick={handleEditToggle}
                            className="rounded-2xl px-4 py-2 shadow-sm text-white bg-gradient-to-r from-pink-300 to-purple-300 hover:opacity-90 transition"
                        >
                            수정
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="rounded-2xl px-4 py-2 shadow-sm text-white bg-gradient-to-r from-pink-300 to-purple-300 hover:opacity-90 transition disabled:opacity-60"
                            >
                                {saving ? "저장 중…" : "저장"}
                            </button>
                            <button
                                onClick={handleEditToggle}
                                disabled={saving}
                                className="rounded-2xl px-4 py-2 shadow-sm ring-1 ring-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition disabled:opacity-60"
                            >
                                취소
                            </button>
                        </>
                    )}

                    <button
                        onClick={handleDelete}
                        disabled={deleting}
                        className="rounded-2xl px-4 py-2 shadow-sm ring-1 ring-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 transition disabled:opacity-60"
                    >
                        {deleting ? "삭제 중…" : "삭제"}
                    </button>
                </div>
            </div>

            {/* 본문 카드 */}
            <div className="rounded-3xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                {/* 제목줄 */}
                <div className="px-5 md:px-6 py-5 border-b border-gray-100">
                    {loading ? (
                        <div className="h-6 w-2/3 bg-gray-100 rounded animate-pulse" />
                    ) : err ? (
                        <p className="text-sm text-rose-600">{err}</p>
                    ) : (
                        <>
                            {!editMode ? (
                                <h1 className="text-xl md:text-2xl font-semibold text-gray-900 break-words">
                                    {data?.title}
                                </h1>
                            ) : (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">제목</label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full rounded-xl border text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-200 border-gray-200"
                                        maxLength={120}
                                    />
                                </div>
                            )}

                            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                <span className={`px-2.5 py-1 rounded-full text-xs ${statusClass}`}>
                  {data?.qnaStatus === "ANSWERED"
                      ? "답변완료"
                      : data?.qnaStatus === "WAITING"
                          ? "답변대기"
                          : data?.qnaStatus}
                </span>
                                <span className="px-2 py-0.5 rounded-full text-xs bg-gray-50 ring-1 ring-gray-200 text-gray-600">
                  QnA
                </span>
                                <span className="text-gray-400">•</span>
                                <span className="text-gray-600">등록 {fmtDate(data?.regDate)}</span>
                                {data?.modDate && (
                                    <>
                                        <span className="text-gray-400">•</span>
                                        <span className="text-gray-600">수정 {fmtDate(data?.modDate)}</span>
                                    </>
                                )}
                            </div>
                        </>
                    )}
                </div>

                {/* 내용 */}
                <div className="px-5 md:px-6 py-6">
                    {loading ? (
                        <div className="space-y-3">
                            <div className="h-4 bg-gray-100 rounded animate-pulse" />
                            <div className="h-4 bg-gray-100 rounded animate-pulse w-11/12" />
                            <div className="h-4 bg-gray-100 rounded animate-pulse w-10/12" />
                            <div className="h-4 bg-gray-100 rounded animate-pulse w-9/12" />
                        </div>
                    ) : err ? (
                        <p className="text-sm text-rose-600">{err}</p>
                    ) : !editMode ? (
                        <article className="prose prose-sm md:prose-base max-w-none text-gray-900 whitespace-pre-wrap break-words">
                            {data?.content}
                        </article>
                    ) : (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">내용</label>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="w-full min-h-[220px] rounded-xl border text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-200 resize-y border-gray-200"
                                placeholder="수정할 내용을 입력하세요."
                            />
                            {saveErr && (
                                <p className="mt-2 text-sm text-rose-600">{saveErr}</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
