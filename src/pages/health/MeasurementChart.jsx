import React, { useEffect, useState } from "react";
import api from "@/components/common/api/axiosInterceptor.js";
import { useAuthStore } from "@/components/common/hooks/useAuthStore";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceArea,
  Dot
} from "recharts";
import dayjs from "dayjs";
import { TrendingUp, TrendingDown, Minus, Award } from "lucide-react";

// 하루 중 가장 최신 데이터만 남기기
const latestByDate = (list) => {
  const grouped = {};
  list.forEach((item) => {
    const date = dayjs(item.measuredDate).format("YYYY-MM-DD");
    if (!grouped[date] || dayjs(item.measuredDate).isAfter(grouped[date].measuredDate)) {
      grouped[date] = item;
    }
  });

  return Object.entries(grouped)
    .map(([date, item]) => ({ ...item, date }))
    .sort((a, b) => dayjs(a.date).diff(dayjs(b.date)));
};

// 통계 계산
const calculateStats = (data, key) => {
  if (!data || data.length === 0) return { avg: 0, change: 0, trend: "stable", best: 0 };

  const values = data.map(d => d[key]).filter(v => v);
  if (values.length === 0) return { avg: 0, change: 0, trend: "stable", best: 0 };

  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  const recent = values[values.length - 1];
  const previous = values[0];
  const change = recent - previous;
  const changePercent = previous !== 0 ? ((change / previous) * 100).toFixed(1) : 0;

  let trend = "stable";
  if (Math.abs(change) > avg * 0.05) {
    trend = change > 0 ? "up" : "down";
  }

  const best = Math.min(...values);

  return { avg: avg.toFixed(1), change: change.toFixed(1), changePercent, trend, best: best.toFixed(1), recent: recent.toFixed(1) };
};

// 커스텀 툴팁
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
        <p className="font-semibold text-gray-800 mb-2">{dayjs(label).format('YYYY년 MM월 DD일')}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }} className="text-sm">
            {entry.name}: <span className="font-bold">{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

function MeasurementChart() {
  const { member } = useAuthStore();
  const [period, setPeriod] = useState("week");
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleLines, setVisibleLines] = useState({
    weight: true,
    bloodSugar: true,
    bloodPressureSystolic: true,
    bloodPressureDiastolic: true,
    sleepHours: true
  });

  useEffect(() => {
    fetchChartData();
  }, [period]);

  const fetchChartData = async () => {
    try {
      setLoading(true);

      // 🔥 실제 API 호출
      const res = await api.get("/health/measurement/chart", {
        params: { period },
        headers: { "X-Member-Id": member?.id }
      });

      console.log("📊 차트 데이터:", res.data);

      const dailyData = latestByDate(res.data);
      setChartData(dailyData);
    } catch (err) {
      console.error("📉 차트 불러오기 실패:", err);
      setChartData([]);
    } finally {
      setLoading(false);
    }
  };

  // 통계 계산
  const stats = {
    weight: calculateStats(chartData, 'weight'),
    bloodSugar: calculateStats(chartData, 'bloodSugar'),
    sleepHours: calculateStats(chartData, 'sleepHours')
  };

  const toggleLine = (key) => {
    setVisibleLines(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const TrendIcon = ({ trend }) => {
    if (trend === "up") return <TrendingUp className="w-4 h-4 text-red-500" />;
    if (trend === "down") return <TrendingDown className="w-4 h-4 text-green-500" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl">
      <h1 className="text-3xl font-extrabold text-center bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent mb-8">
        건강정보 차트
      </h1>

      {/* 미니 통계 카드 */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 font-semibold">평균 체중</span>
            <TrendIcon trend={stats.weight.trend} />
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-pink-500">{stats.weight.avg}</span>
            <span className="text-sm text-gray-500 mb-1">kg</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {stats.weight.change > 0 ? '+' : ''}{stats.weight.change}kg ({stats.weight.changePercent}%)
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 font-semibold">평균 혈당</span>
            <TrendIcon trend={stats.bloodSugar.trend} />
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-indigo-500">{stats.bloodSugar.avg}</span>
            <span className="text-sm text-gray-500 mb-1">mg/dL</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {stats.bloodSugar.change > 0 ? '+' : ''}{stats.bloodSugar.change} ({stats.bloodSugar.changePercent}%)
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 font-semibold">평균 수면</span>
            <Award className="w-4 h-4 text-teal-500" />
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-teal-500">{stats.sleepHours.avg}</span>
            <span className="text-sm text-gray-500 mb-1">시간</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            최고 기록: {stats.sleepHours.best}시간 🏆
          </p>
        </div>
      </div>

      {/* 기간 선택 버튼 */}
      <div className="flex justify-center space-x-3 mb-6">
        {[
          { label: "1주일", value: "week" },
          { label: "1개월", value: "month" },
          { label: "3개월(분기)", value: "quarter" },
          { label: "6개월(반기)", value: "half" },
          { label: "1년", value: "year" },
        ].map((btn) => (
          <button
            key={btn.value}
            onClick={() => setPeriod(btn.value)}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 shadow-sm
              ${
              period === btn.value
                ? "bg-gradient-to-r from-pink-400 to-purple-500 text-white shadow-md scale-105"
                : "bg-white hover:bg-gray-50 text-gray-700 hover:shadow-md"
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* 지표 토글 버튼 */}
      <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
        <p className="text-sm text-gray-600 font-semibold mb-3">표시할 지표 선택</p>
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'weight', label: '체중', color: '#EC4899' },
            { key: 'bloodSugar', label: '혈당', color: '#6366F1' },
            { key: 'bloodPressureSystolic', label: '수축기 혈압', color: '#F59E0B' },
            { key: 'bloodPressureDiastolic', label: '이완기 혈압', color: '#10B981' },
            { key: 'sleepHours', label: '수면시간', color: '#14B8A6' }
          ].map(item => (
            <button
              key={item.key}
              onClick={() => toggleLine(item.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                visibleLines[item.key]
                  ? 'text-white shadow-sm'
                  : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
              }`}
              style={visibleLines[item.key] ? { backgroundColor: item.color } : {}}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* 로딩 표시 */}
      {loading && (
        <p className="text-center text-gray-400 mb-4">📊 데이터를 불러오는 중...</p>
      )}

      {/* 데이터 없음 표시 */}
      {!loading && chartData.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">선택된 기간에 데이터가 없습니다.</p>
          <p className="text-gray-400 text-sm">건강정보를 등록하면 차트가 표시됩니다.</p>
        </div>
      )}

      {/* 차트 */}
      {!loading && chartData.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-md">
          <ResponsiveContainer width="100%" height={450}>
            <LineChart data={chartData}>
              <defs>
                <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EC4899" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#EC4899" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                tickFormatter={(date) => dayjs(date).format("MM/DD")}
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
              />
              <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="top"
                height={50}
                iconType="line"
                wrapperStyle={{ paddingBottom: '20px' }}
              />

              {/* 정상 범위 음영 - 혈당 */}
              {visibleLines.bloodSugar && (
                <ReferenceArea y1={70} y2={110} fill="#10B981" fillOpacity={0.05} />
              )}

              {/* 데이터 라인들 - 조건부 렌더링 */}
              {visibleLines.weight && (
                <Line
                  type="monotone"
                  dataKey="weight"
                  name="체중(kg)"
                  stroke="#EC4899"
                  strokeWidth={3}
                  dot={{ fill: '#EC4899', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              )}
              {visibleLines.bloodPressureSystolic && (
                <Line
                  type="monotone"
                  dataKey="bloodPressureSystolic"
                  name="혈압(수축)"
                  stroke="#F59E0B"
                  strokeWidth={3}
                  dot={{ fill: '#F59E0B', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              )}
              {visibleLines.bloodPressureDiastolic && (
                <Line
                  type="monotone"
                  dataKey="bloodPressureDiastolic"
                  name="혈압(이완)"
                  stroke="#10B981"
                  strokeWidth={3}
                  dot={{ fill: '#10B981', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              )}
              {visibleLines.bloodSugar && (
                <Line
                  type="monotone"
                  dataKey="bloodSugar"
                  name="혈당(mg/dL)"
                  stroke="#6366F1"
                  strokeWidth={3}
                  dot={{ fill: '#6366F1', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              )}
              {visibleLines.sleepHours && (
                <Line
                  type="monotone"
                  dataKey="sleepHours"
                  name="수면(시간)"
                  stroke="#14B8A6"
                  strokeWidth={3}
                  dot={{ fill: '#14B8A6', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* AI 인사이트 */}
      {!loading && chartData.length > 0 && (
        <div className="mt-6 p-5 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <p className="font-semibold text-gray-800 mb-1">건강 인사이트</p>
              <p className="text-sm text-gray-700">
                {stats.bloodSugar.trend === "up" && "혈당 수치가 상승 추세예요. 식단 관리에 신경써보세요."}
                {stats.weight.trend === "down" && "체중 감량이 순조롭네요! 계속 유지하세요 💪"}
                {stats.sleepHours.avg < 7 && "수면 시간이 부족해요. 충분한 휴식을 취하세요 😴"}
                {stats.weight.trend === "stable" && stats.bloodSugar.trend === "stable" && "전반적으로 안정적인 상태를 유지하고 있어요! ✨"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MeasurementChart;