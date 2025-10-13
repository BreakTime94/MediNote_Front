import React, { useEffect, useState } from "react";
import api from "@/components/common/api/axiosInterceptor.js";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceArea,
} from "recharts";

/**
 * 인덱스 페이지 건강 요약 섹션
 * - 체중(BMI), 혈압, 혈당 차트 표시
 * - 백엔드에서 최근 측정 데이터 요약(summary) 표시
 */
export default function HealthSummarySection() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const res = await api.get("/health/measurement/summary");
      setData(res.data);
    } catch (e) {
      console.error("요약 데이터 조회 실패:", e);
    }
  };

  if (!data)
    return (
        <div className="text-center py-10 text-gray-500">
          건강정보를 불러오는 중입니다...
        </div>
    );

  return (
      <section className="max-w-6xl mx-auto py-10 space-y-12">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-8">
          내 건강 현황
        </h2>

        {/* ✅ 차트 3개 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <WeightChart bmi={data.bmi} status={data.bmiStatus} />
          <BloodPressureChart
              systolic={data.systolic}
              diastolic={data.diastolic}
              status={data.bloodPressureStatus}
          />
          <BloodSugarChart
              bloodSugar={data.bloodSugar}
              status={data.bloodSugarStatus}
          />
        </div>

        {/* ✅ 상태 요약 문장 */}
        <div className="mt-8 p-6 bg-gray-50 rounded-xl text-center shadow-sm">
          <p className="text-lg text-gray-700 font-medium">{data.summary}</p>
        </div>
      </section>
  );
}

/* ---------------------------------------------
   체중 (BMI) LineChart
--------------------------------------------- */
function WeightChart({ bmi, status }) {
  const chartData = [
    { name: "현재", value: bmi },
    { name: "정상", value: 22 },
  ];

  return (
      <div className="bg-white p-5 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold mb-3 text-center">체중 (BMI)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line
                type="monotone"
                dataKey="value"
                stroke="#C4A1FF"
                strokeWidth={3}
                dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
        <p className="text-center text-sm text-gray-600 mt-3">
          <span className="font-semibold">현재:</span> {bmi} /{" "}
          <span>{status}</span>
        </p>
      </div>
  );
}

/* ---------------------------------------------
   혈압 (mmHg) BarChart
--------------------------------------------- */
function BloodPressureChart({ systolic, diastolic, status }) {
  const chartData = [{ name: "현재", systolic, diastolic }];

  return (
      <div className="bg-white p-5 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold mb-3 text-center">혈압 (mmHg)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="systolic" name="수축기" fill="#FFA6A6" />
            <Bar dataKey="diastolic" name="이완기" fill="#A6D8FF" />
          </BarChart>
        </ResponsiveContainer>
        <p className="text-center text-sm text-gray-600 mt-3">
          <span className="font-semibold">현재:</span> {systolic}/{diastolic} /{" "}
          <span>{status}</span>
        </p>
      </div>
  );
}

/* ---------------------------------------------
   혈당 (mg/dL) AreaChart
--------------------------------------------- */
function BloodSugarChart({ bloodSugar, status }) {
  const chartData = [
    { name: "현재", value: bloodSugar },
    { name: "정상", value: 90 },
  ];

  return (
      <div className="bg-white p-5 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold mb-3 text-center">혈당 (mg/dL)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            {/* 정상 범위 시각화 영역 */}
            <ReferenceArea y1={70} y2={110} fill="#FFF7D6" opacity={0.4} />
            <Area
                type="monotone"
                dataKey="value"
                stroke="#9AE5C4"
                fill="#DFF7EB"
                strokeWidth={3}
            />
          </AreaChart>
        </ResponsiveContainer>
        <p className="text-center text-sm text-gray-600 mt-3">
          <span className="font-semibold">현재:</span> {bloodSugar} /{" "}
          <span>{status}</span>
        </p>
      </div>
  );
}
