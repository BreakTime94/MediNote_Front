import React from "react";
import SummarySection from "../health/SummarySection.jsx";
import {useAuthStore} from "@/components/common/hooks/useAuthStore.jsx";
import SummarySectionPreview from "@/pages/health/SummarySectionPreview.jsx";

export default function Index(){
  const {member, loading, fetchMember} = useAuthStore();
  console.log("🔍 Index.jsx - member:", member);
  console.log("🔍 Index.jsx - loading:", loading);
  //로그인 여부에 따라 화면 다르게 구성
  //이 페이지는 로그인 여부 나누기 위한 중간 문지기 역할

  if(loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-xl text-gray-600">로딩 중...</div>
        </div>
      </div>
    );
  }

  // 로그인 안 됨
  if(!member) {
    console.log("member 없음 → Preview");
    return <SummarySectionPreview />;
  }

  // 로그인 됨
  console.log("member 있음 → SummarySection");
  return <SummarySection />;
}

