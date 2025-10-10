import React, {useEffect, useState} from "react";
import {LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid,} from "recharts";
//라인차트 컨테이너, 실제 선 그래프,x축, y축, 마우스오버시 정보 표시, 범례(어떤 선이 뭔지), 반응형 크기 조절, 격자배경
import dayjs from "dayjs";

//임시 데이터ㅓ - 나중에 백이랑 연결 예정
const mockData = [
  { measuredDate: "2025-10-01T08:00:00", height: 160, weight: 52, bloodPressureSystolic: 120, bloodPressureDiastolic: 80, bloodSugar: 90, sleepHours: 6 },
  { measuredDate: "2025-10-01T22:00:00", height: 160, weight: 52, bloodPressureSystolic: 118, bloodPressureDiastolic: 79, bloodSugar: 92, sleepHours: 7 },
  { measuredDate: "2025-10-02T21:00:00", height: 160, weight: 51, bloodPressureSystolic: 117, bloodPressureDiastolic: 78, bloodSugar: 88, sleepHours: 6 },
  { measuredDate: "2025-10-03T22:30:00", height: 160, weight: 50, bloodPressureSystolic: 122, bloodPressureDiastolic: 82, bloodSugar: 100, sleepHours: 8 },
  { measuredDate: "2025-10-04T20:15:00", height: 160, weight: 50, bloodPressureSystolic: 119, bloodPressureDiastolic: 80, bloodSugar: 91, sleepHours: 7 },
  { measuredDate: "2025-10-05T21:00:00", height: 160, weight: 51, bloodPressureSystolic: 121, bloodPressureDiastolic: 79, bloodSugar: 94, sleepHours: 6 },
];

// TODO: 백엔드 연결 후 아래 코드로 교체
// useEffect(() => {
//   api.get("/health/measurement/chart").then(res => {
//     const dailyData = latestByDate(res.data);
//     const filtered = filterByPeriod(dailyData, period === "ALL" ? "ALL" : parseInt(period));
//     setChartData(filtered);
//   });
// }, [period]);

//하루 중 가장 최신 데이터
const latestByDate = (list) => {
  const grouped = {}; //짜를 키(key)로, 해당 날짜의 최신 데이터를 값(value)로 저장할 객체

  list.forEach((item) => {
    const date = dayjs(item.measuredDate).format("YYYY-MM-DD");
    if(!grouped[date] || dayjs(item.measuredDate).isAfter(grouped[date].measuredDate)) {
      //해당날짜가 없으면 저장하고 데이터가 있으면 비교해서 최신 데이터 사용
      grouped[date] = item;
    }
  });

  return Object.entries(grouped)  //객체를 [키, 값] 배열로 변환
    .map(([date, item]) => ({...item, date}))
    .sort((a,b) => dayjs(a.date).diff(dayjs(b.date)));
};

//기간 필터 함수
const filterByPeriod = (data, periodDays) => {
  if(periodDays === "ALL") return data;
  const startDate = dayjs().subtract(periodDays, "day");
  return data.filter((d) => dayjs(d.date).isAfter(startDate));
};

function TestMeasurementChart(props) {
  const [period, setPeriod] = useState("ALL");
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const dailyData = latestByDate(mockData);
    const filtered = filterByPeriod(dailyData, period === "ALL" ? "ALL" : parseInt(period));
    setChartData(filtered);
  },[period]);

  return (
    <div className="max-2-6xl mx-auto p-6 bg-white shadow-md rounded-xl">
      <h1 className="text-3xl font-extrabold text-center bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent mb-6">건강정보 차트</h1>

      {/*기간 선택*/}
      <div className="flex justify-center space-x-3 mb-6">
        {[
          {label: "7일", value: "7"},
          { label: "30일", value: "30" },
          { label: "90일", value: "90" },
          { label: "전체", value: "ALL" },
        ].map((btn) => (
          <button
          key={btn.value}
          onClick={() => setPeriod(btn.value)}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition 
            ${period === btn.value
            ? "bg-gradient-to-r from-pink-400 to-purple-500 text-white"
            : "bg-gray-100 hover:bg-gray-200"}`}>
            {btn.label}
          </button>
        ))}
      </div>
      {/* 차트 영역 */}
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray = "3 3"/>
          <XAxis
            dataKey="date"
            tickFormatter={(data) => dayjs(data).format("MM/DD")}
            stroke="#888" />
          <YAxis stroke="#888" />
          <Tooltip
            formatter={(value, name) => [`${value}`, name]}
            labelFormatter={(label) => `날짜: ${label}`} />
          <Legend verticalAlign="top" height={36} />

          {/* 수치형 데이터 라인들 */}
          <Line type="monotone" dataKey="height" name="키(cm)" stroke="#8B5CF6" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="weight" name="체중(kg)" stroke="#EC4899" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="bloodPressureSystolic" name="혈압(수축)" stroke="#F59E0B" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="bloodPressureDiastolic" name="혈압(이완)" stroke="#10B981" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="bloodSugar" name="혈당(mg/dL)" stroke="#6366F1" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="sleepHours" name="수면(시간)" stroke="#14B8A6" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>

      {/* 데이터 없음 표시 */}
      {chartData.length === 0 && (
        <p className="text-center text-gray-500 mt-6"> 선택된 기간에 데이터가 없습니다.</p>
      )}
    </div>
  );
}
export default TestMeasurementChart;