import React, { useEffect, useState } from "react";
import api from "@/components/common/api/axiosInterceptor.js";
import {
  ResponsiveContainer, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceArea,} from "recharts";
import { Activity, Moon, Droplet, Heart } from "lucide-react";

/* 인덱스 페이지 건강 요약 섹션 - Premium Edition */
export default function HealthSummarySection() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      // ✅ 백엔드 호출
      const res = await api.get("/health/measurement/summary", {
        headers: { "Cache-Control": "no-cache" },
      });

      console.log("✅ summary response:", res.data);

      // ✅ 유효성 검사 추가
      if (res.data && typeof res.data === "object") {
        setData(res.data);
      } else {
        console.warn("⚠️ 서버 응답 형식이 예상과 다름:", res.data);
        setData(null);
      }

    } catch (err) {
      console.error(" 요약 데이터 불러오기 실패:", err.response?.data || err.message);
      setData(null); // 에러 시에도 UI가 깨지지 않게 null 처리
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
        <div className="text-center py-12 text-gray-400">
          건강정보를 불러오는 중입니다...
        </div>
    );

  if (!data)
    return (
        <div className="text-center py-12 text-gray-400">
          최근 등록된 건강정보가 없습니다.
        </div>
    );

  return (
      <section className="max-w-7xl mx-auto py-12 px-4 space-y-8">
        <h2 className="text-3xl font-bold text-gray-400 text-center mb-8 tracking-tight">
          Health Dashboard
        </h2>

        {/* 한 줄 4개 카드 - 간격 증가 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
          <BMICard
              bmi={data?.bmi}
              status={data?.bmiStatus}
              height={data?.height}
              weight={data?.weight}
          />
          <BloodSugarChart
              bloodSugar={data.bloodSugar}
              status={data.bloodSugarStatus}
          />
          <SleepChart sleepHours={data.sleepHours} status={data.sleepStatus} />
          <HealthScoreChart score={data.healthScore || 80} />
        </div>

        <div className="mt-8 p-6 bg-gradient-to-r from-[#F8FAFC] to-[#F1F5F9] rounded-2xl text-center shadow-sm border border-gray-100">
          <p className="text-base text-gray-700 font-medium leading-relaxed">
            {data.summary ?? "전반적으로 건강 상태가 안정적입니다 ✨"}
          </p>
        </div>
      </section>
  );
}

/* ---------------------------------------------
   BMI 카드 (타이포그래피 개선 + 아이콘)
--------------------------------------------- */
function BMICard({ bmi, status, height, weight }) {
  const colorMap = {
    저체중: "#60a5fa",
    정상: "#34d399",
    과체중: "#fbbf24",
    비만: "#f87171",
  };
  const color = colorMap[status] || "#34d399";
  const minHealthyWeight = height
      ? (18.5 * ((height / 100) ** 2)).toFixed(1)
      : 53.5;
  const maxHealthyWeight = height
      ? (23 * ((height / 100) ** 2)).toFixed(1)
      : 66.5;

  return (
      <div className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300 flex flex-col items-center justify-start h-full border border-gray-50">
        {/* 제목 + 아이콘 */}
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5 text-purple-400" />
          <h3 className="text-sm font-bold tracking-wide text-gray-700 uppercase">
            현재 BMI
          </h3>
        </div>

        {/* 숫자 더 크게 */}
        <div className="flex flex-col items-center justify-center mb-4">
        <span className="text-7xl font-extrabold tracking-tight mb-3" style={{ color }}>
          {bmi ?? "-"}
        </span>
          <span
              className="text-sm font-bold px-3 py-1.5 rounded-full"
              style={{ backgroundColor: color + "15", color }}
          >
          {status ?? "-"}
        </span>
        </div>

        <p className="text-sm text-gray-600 mb-2 font-medium">건강한 상태</p>
        <p className="text-xs text-gray-400 leading-relaxed">
          권장 체중: {minHealthyWeight}kg - {maxHealthyWeight}kg
        </p>
      </div>
  );
}

/* ---------------------------------------------
   혈당 차트 (그라데이션 fill + 개선된 디자인)
--------------------------------------------- */
function BloodSugarChart({ bloodSugar, status }) {
  const colorMap = {
    저혈당: "#fb923c",
    정상: "#34d399",
    공복혈당장애: "#fbbf24",
    "당뇨 의심": "#ef4444",
  };
  const color = colorMap[status] || "#34d399";

  const chartData = [
    { name: "현재", value: bloodSugar },
    { name: "정상", value: 90 },
  ];

  return (
      <div className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300 flex flex-col h-full border border-gray-50">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Droplet className="w-5 h-5 text-emerald-400" />
          <h3 className="text-sm font-bold tracking-wide text-gray-700 uppercase">
            혈당 (mg/dL)
          </h3>
        </div>

        <div className="flex-1 flex items-center">
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="bloodSugarGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={color} stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12, fill: '#9ca3af' }}
                  axisLine={{ stroke: '#e5e7eb' }}
              />
              <YAxis
                  domain={[50, 160]}
                  tick={{ fontSize: 12, fill: '#9ca3af' }}
                  axisLine={{ stroke: '#e5e7eb' }}
              />
              <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
              />
              <ReferenceArea y1={70} y2={110} fill="#FFF7D6" opacity={0.3} />
              <Area
                  type="monotone"
                  dataKey="value"
                  stroke={color}
                  fill="url(#bloodSugarGradient)"
                  strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="text-center mt-3">
          <p className="text-xs text-gray-500 leading-relaxed">
            <span className="font-semibold text-gray-700">현재:</span> {bloodSugar} /{" "}
            <span style={{ color }} className="font-medium">{status}</span>
          </p>
        </div>
      </div>
  );
}

/* ---------------------------------------------
   수면 차트 (그라데이션 바 + 둥근 모서리)
--------------------------------------------- */
function SleepChart({ sleepHours, status }) {
  const colorMap = {
    "수면 부족": "#fb923c",
    "적정 수면": "#a78bfa",
    "수면 과다": "#fbbf24",
  };
  const color = colorMap[status] || "#a78bfa";

  const chartData = [
    { name: "현재", value: sleepHours },
    { name: "권장", value: 7 },
  ];

  return (
      <div className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300 flex flex-col h-full border border-gray-50">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Moon className="w-5 h-5 text-purple-400" />
          <h3 className="text-sm font-bold tracking-wide text-gray-700 uppercase">
            수면 (시간)
          </h3>
        </div>

        <div className="flex-1 flex items-center">
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={chartData}>
              <defs>
                <linearGradient id="sleepGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.9}/>
                  <stop offset="100%" stopColor={color} stopOpacity={0.6}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12, fill: '#9ca3af' }}
                  axisLine={{ stroke: '#e5e7eb' }}
              />
              <YAxis
                  domain={[0, 12]}
                  tick={{ fontSize: 12, fill: '#9ca3af' }}
                  axisLine={{ stroke: '#e5e7eb' }}
              />
              <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
              />
              <Bar
                  dataKey="value"
                  fill="url(#sleepGradient)"
                  radius={[12, 12, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="text-center mt-3">
          <p className="text-xs text-gray-500 leading-relaxed">
            <span className="font-semibold text-gray-700">현재:</span> {sleepHours}시간 /{" "}
            <span style={{ color }} className="font-medium">{status}</span>
          </p>
        </div>
      </div>
  );
}

/* ---------------------------------------------
   Health Score (드롭 섀도우 + 부드러운 애니메이션)
--------------------------------------------- */
function HealthScoreChart({ score }) {
  const getScoreColor = (score) => {
    if (score >= 80) return "#c084fc";
    if (score >= 60) return "#f9a8d4";
    return "#fb923c";
  };
  const color = getScoreColor(score);

  return (
      <div className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300 flex flex-col items-center justify-start h-full border border-gray-50">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Heart className="w-5 h-5 text-blue-400" />
          <h3 className="text-sm font-bold tracking-wide text-gray-700 uppercase">
            Health Score
          </h3>
        </div>

        {/* 원형 게이지 중앙 정렬 + 드롭 섀도우 */}
        <div className="relative w-32 h-32 flex items-center justify-center"
             style={{ filter: `drop-shadow(0 4px 12px ${color}30)` }}>
          <svg
              viewBox="0 0 120 120"
              className="w-full h-full transform -rotate-90"
          >
            <circle
                cx="60"
                cy="60"
                r="50"
                stroke="#f3f4f6"
                strokeWidth="12"
                fill="none"
            />
            <circle
                cx="60"
                cy="60"
                r="50"
                stroke={color}
                strokeWidth="12"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 50}`}
                strokeDashoffset={`${2 * Math.PI * 50 * (1 - score / 100)}`}
                strokeLinecap="round"
                style={{
                  transition: "stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="flex items-end">
            <span className="text-5xl font-extrabold leading-none tracking-tight" style={{ color }}>
              {score}
            </span>
              <span className="text-sm text-gray-400 mb-2 ml-1 font-medium">점</span>
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-400 mt-3 font-medium">100점 만점 기준</p>
      </div>
  );
}