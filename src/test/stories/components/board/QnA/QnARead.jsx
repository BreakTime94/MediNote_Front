// src/test/stories/QnARead.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../../member/axiosInterceptor.js";

export default function QnARead() {
    const { id } = useParams();          // URL 파라미터에서 id 가져오기
    const navigate = useNavigate();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const res = await api.get(`http://localhost:8082/api/boards/${id}`);
            setItem(res.data);
        } catch (err) {
            console.error("QnA 단일 조회 실패:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    if (loading) return <div style={{ padding: 16 }}>불러오는 중...</div>;
    if (!item) return <div style={{ padding: 16 }}>데이터 없음</div>;

    return (
        <div style={{ padding: 16 }}>
            <h3>QnA 상세 조회</h3>
            <p><strong>ID:</strong> {item.id}</p>
            <p><strong>제목:</strong> {item.title}</p>
            <p><strong>내용:</strong> {item.content}</p>
            <p><strong>상태:</strong> {item.qnaStatus}</p>
            <p><strong>공개 여부:</strong> {item.isPublic ? "공개" : "비공개"}</p>
            <p><strong>등록일:</strong> {item.regDate}</p>

            <button onClick={() => navigate("/qna")} style={{ marginTop: 16 }}>
                목록으로
            </button>
        </div>
    );
}
