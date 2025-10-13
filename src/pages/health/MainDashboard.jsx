import React, { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer,
  RadialBarChart, RadialBar, Legend
} from "recharts";
import api from "@/api/axiosInterceptor.js";

export default function MainDashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await api.get("/health/measurement/summary");
        setSummary(res.data);

      } catch (e) {
        console.error("❌ 요약 데이터 불러오기 실패:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  if (loading) return <p className="text-center mt-10">건강정보를 불러오는 중입니다...</p>;
  if (!summary) return <p className="text-center mt-10">요약 데이터가 없습니다.</p>;

  // ✅ 백엔드 데이터 매핑 (fallback 처리)
  const bmi = summary.bmi
    ? parseFloat(summary.bmi).toFixed(1)
    : summary.height && summary.weight
      ? (summary.weight / (summary.height / 100) ** 2).toFixed(1)
      : "-";

  const bmiStatus = summary.bmiStatus || "정보 없음";
  const bloodSugar = summary.bloodSugar ?? "-";
  const bloodSugarStatus = summary.bloodSugarStatus || "정보 없음";
  const sleep = summary.sleepHours ?? "-";
  const sleepStatus = summary.sleepStatus || "정보 없음";

  const healthText = summary.summary || "최근 측정 데이터를 기반으로 분석 중입니다.";

  // ✅ 기준값
  const bmiNormal = 22;
  const sugarNormal = 100;
  const sleepNormal = 7;

  // ✅ 차트 데이터
  const bmiData = [
    { name: "정상", value: bmiNormal },
    { name: "현재", value: parseFloat(bmi) },
  ];
  const sugarData = [
    { name: "정상", value: sugarNormal },
    { name: "현재", value: bloodSugar },
  ];
  const sleepData = [
    { name: "권장", value: sleepNormal },
    { name: "현재", value: sleep },
  ];

  const healthScoreData = [{ name: "점수", uv: 80, fill: "#93c5fd" }];

  return (
    <div className="w-full flex flex-col items-center gap-8 p-8 bg-gradient-to-b from-[#f9f9ff] to-[#f3f4f6] min-h-screen">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">내 건강 현황</h2>

      {/* === 3개 지표 === */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-6xl">

        {/* BMI */}
        <MetricCard
          title="체중 (BMI)"
          color="#7c4dff"
          data={bmiData}
          unit=""
          reference={bmiNormal}
          current={bmi}
          status={bmiStatus}
          domain={[0, 35]}
          referenceLabel="정상"
        />

        {/* 수면시간 */}
        <MetricCard
          title="수면시간 (시간)"
          color="#3b82f6"
          data={sleepData}
          unit="시간"
          reference={sleepNormal}
          current={sleep}
          status={sleepStatus}
          domain={[0, 12]}
          referenceLabel="권장"
        />

        {/* 혈당 */}
        <MetricCard
          title="혈당 (mg/dL)"
          color="#10b981"
          data={sugarData}
          unit="mg/dL"
          reference={sugarNormal}
          current={bloodSugar}
          status={bloodSugarStatus}
          domain={[50, 150]}
          referenceLabel="정상"
        />
      </div>

      {/* === Health Score === */}
      <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4 text-[#2563eb]">오늘의 Health Score</h3>
        <ResponsiveContainer width="100%" height={250}>
          <RadialBarChart innerRadius="80%" outerRadius="100%" barSize={20} data={healthScoreData} startAngle={180} endAngle={0}>
            <RadialBar minAngle={15} background clockWise dataKey="uv" cornerRadius={50} />
            <Legend
              iconSize={0}
              layout="vertical"
              verticalAlign="middle"
              wrapperStyle={{
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                textAlign: "center",
                lineHeight: "24px",
                fontSize: "24px",
                fontWeight: "bold",
              }}
              payload={[{ value: `${healthScoreData[0].uv}점`, color: "#93c5fd" }]}
            />
          </RadialBarChart>
        </ResponsiveContainer>
        <p className="text-gray-500 text-sm mt-2">100점 만점 기준</p>
      </div>

      {/* === 건강 요약 === */}
      <div className="bg-[#fef3c7] rounded-2xl shadow p-4 w-full max-w-3xl text-center">
        <p className="text-gray-800 font-medium text-base">{healthText}</p>
      </div>
    </div>
  );
}

/* ✅ 공통 차트 카드 컴포넌트 */
function MetricCard({ title, color, data, unit, reference, current, status, domain, referenceLabel }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-4 flex flex-col items-center">
      <h3 className="text-lg font-semibold mb-2" style={{ color }}>{title}</h3>
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
          <XAxis dataKey="name" />
          <YAxis domain={domain} />
          <Tooltip formatter={(v) => [`${v}${unit}`, "수치"]} />
          <Line type="monotone" dataKey="value" stroke={color} strokeWidth={3} dot={{ r: 6 }} />
          <ReferenceLine
            y={reference}
            label={{ value: `${referenceLabel} ${reference}${unit}`, position: "right", fill: color, fontSize: 12 }}
            stroke={color}
            strokeDasharray="5 5"
          />
        </LineChart>
      </ResponsiveContainer>
      <div className="mt-3 text-center">
        <p className="text-sm text-gray-700">
          <b>현재:</b> {current !== "-" ? `${current}${unit} / ${status}` : "데이터 없음"}
        </p>
        <p className="text-sm text-gray-700">
          <b>기준:</b> {reference}{unit}
        </p>
      </div>
    </div>
  );
}
