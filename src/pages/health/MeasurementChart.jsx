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
import { TrendingUp, TrendingDown, Minus, Award, Activity, HelpCircle, X } from "lucide-react";

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

// 건강점수 등급 계산
const getHealthScoreGrade = (score) => {
  if (score >= 95) return { grade: 'A+', color: '#10B981', label: '매우 우수' };
  if (score >= 90) return { grade: 'A', color: '#34D399', label: '우수' };
  if (score >= 85) return { grade: 'B+', color: '#60A5FA', label: '양호' };
  if (score >= 80) return { grade: 'B', color: '#93C5FD', label: '보통' };
  if (score >= 70) return { grade: 'C', color: '#FBBF24', label: '주의' };
  return { grade: 'D', color: '#F87171', label: '관리 필요' };
};

// 산정 기준 모달
const ScoreCriteriaModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* 헤더 */}
        <div className="sticky top-0 bg-gradient-to-r from-pink-400 to-purple-500 text-white p-6 rounded-t-2xl flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Activity className="w-6 h-6" />
            <h2 className="text-2xl font-bold">건강점수 산정 기준</h2>
          </div>
          <button onClick={onClose} className="hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* 내용 */}
        <div className="p-6">
          {/* 총점 안내 */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-5 rounded-xl mb-6 border border-purple-200">
            <p className="text-center text-lg font-semibold text-gray-800">
              총 <span className="text-3xl text-purple-600 font-bold">100점</span> 만점
            </p>
          </div>

          {/* 항목별 배점 */}
          <div className="space-y-4 mb-6">
            <ScoreItem
              title="체중/BMI"
              points={20}
              color="#EC4899"
              description="정상 BMI 범위(18.5~24.9) 유지 시 만점"
              details={[
                "BMI 18.5~24.9: 20점 (만점)",
                "BMI 25~29.9: 15점 (과체중)",
                "BMI 30 이상: 10점 (비만)",
                "BMI 18.5 미만: 12점 (저체중)"
              ]}
            />

            <ScoreItem
              title="혈압"
              points={20}
              color="#F59E0B"
              description="수축기/이완기 혈압이 정상 범위일 때 만점"
              details={[
                "수축기 120 미만, 이완기 80 미만: 20점 (만점)",
                "수축기 120~139, 이완기 80~89: 15점 (주의)",
                "수축기 140 이상, 이완기 90 이상: 10점 (고혈압)"
              ]}
            />

            <ScoreItem
              title="혈당"
              points={20}
              color="#6366F1"
              description="공복 혈당이 정상 범위일 때 만점"
              details={[
                "70~99 mg/dL: 20점 (만점)",
                "100~125 mg/dL: 15점 (공복혈당장애)",
                "126 mg/dL 이상: 10점 (당뇨 의심)",
                "70 mg/dL 미만: 12점 (저혈당)"
              ]}
            />

            <ScoreItem
              title="수면"
              points={15}
              color="#14B8A6"
              description="하루 7~8시간 수면 시 만점"
              details={[
                "7~8시간: 15점 (만점)",
                "6~7시간 또는 8~9시간: 12점",
                "5~6시간 또는 9시간 이상: 8점",
                "5시간 미만: 5점"
              ]}
            />

            <ScoreItem
              title="운동"
              points={15}
              color="#8B5CF6"
              description="주 3회 이상 규칙적인 운동"
              details={[
                "주 5회 이상: 15점 (만점)",
                "주 3~4회: 12점",
                "주 1~2회: 8점",
                "운동 안 함: 3점"
              ]}
            />

            <ScoreItem
              title="생활습관"
              points={10}
              color="#F97316"
              description="음주, 흡연 등 생활습관 평가"
              details={[
                "비흡연, 주 1회 이하 음주: 10점 (만점)",
                "비흡연, 주 2~3회 음주: 7점",
                "흡연 또는 주 4회 이상 음주: 4점",
                "흡연 + 과음: 2점"
              ]}
            />
          </div>

          {/* 등급 기준 */}
          <div className="bg-gray-50 p-5 rounded-xl">
            <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-500" />
              등급 기준
            </h3>
            <div className="space-y-2">
              <GradeItem grade="A+" range="95~100점" color="#10B981" label="매우 우수" />
              <GradeItem grade="A" range="90~94점" color="#34D399" label="우수" />
              <GradeItem grade="B+" range="85~89점" color="#60A5FA" label="양호" />
              <GradeItem grade="B" range="80~84점" color="#93C5FD" label="보통" />
              <GradeItem grade="C" range="70~79점" color="#FBBF24" label="주의" />
              <GradeItem grade="D" range="70점 미만" color="#F87171" label="관리 필요" />
            </div>
          </div>

          {/* 안내 문구 */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-gray-700">
              💡 <span className="font-semibold">건강점수는 참고용입니다.</span> 정확한 건강 상태는 의료 전문가와 상담하세요.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// 점수 항목 컴포넌트
const ScoreItem = ({ title, points, color, description, details }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-bold text-gray-800 flex items-center gap-2">
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></span>
          {title}
        </h4>
        <span className="text-lg font-bold" style={{ color }}>{points}점</span>
      </div>
      <p className="text-sm text-gray-600 mb-3">{description}</p>
      <div className="space-y-1">
        {details.map((detail, idx) => (
          <div key={idx} className="flex items-start gap-2 text-xs text-gray-600">
            <span className="text-purple-500 mt-0.5">•</span>
            <span>{detail}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// 등급 항목 컴포넌트
const GradeItem = ({ grade, range, color, label }) => {
  return (
    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 transition">
      <div className="flex items-center gap-3">
        <div
          className="px-3 py-1 rounded-full text-white font-bold text-sm"
          style={{ backgroundColor: color }}
        >
          {grade}
        </div>
        <span className="text-sm font-semibold text-gray-700">{label}</span>
      </div>
      <span className="text-sm text-gray-600">{range}</span>
    </div>
  );
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
  const [healthScore, setHealthScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [visibleLines, setVisibleLines] = useState({
    weight: true,
    bloodSugar: true,
    bloodPressureSystolic: true,
    bloodPressureDiastolic: true,
    sleepHours: true
  });

  useEffect(() => {
    fetchChartData();
    fetchHealthScore();
  }, [period]);

  const fetchChartData = async () => {
    try {
      setLoading(true);

      const res = await api.get("/health/measurement/chart", {
        params: { period }
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

  const fetchHealthScore = async () => {
    try {
      const res = await api.get("/health/measurement/summary");
      console.log("💯 건강점수:", res.data);
      setHealthScore(res.data.healthScore || 0);
    } catch (err) {
      console.error("💯 건강점수 불러오기 실패:", err);
      setHealthScore(0);
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

  const scoreInfo = healthScore !== null ? getHealthScoreGrade(healthScore) : null;

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl">
      <h1 className="text-3xl font-extrabold text-center bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent mb-8">
        건강정보 차트
      </h1>

      {/* 건강점수 카드 */}
      {scoreInfo && (
        <div className="mb-6 bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <Activity className="w-6 h-6 text-purple-500" />
                <h2 className="text-xl font-bold text-gray-800">현재 건강점수</h2>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="ml-2 p-1.5 hover:bg-purple-100 rounded-full transition group"
                  title="산정 기준 보기"
                >
                  <HelpCircle className="w-5 h-5 text-purple-500 group-hover:text-purple-600" />
                </button>
              </div>
              <div className="flex items-end gap-3">
                <span className="text-6xl font-extrabold" style={{ color: scoreInfo.color }}>
                  {healthScore}
                </span>
                <div className="mb-2">
                  <div
                    className="px-4 py-1 rounded-full text-white font-bold text-lg"
                    style={{ backgroundColor: scoreInfo.color }}
                  >
                    {scoreInfo.grade}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{scoreInfo.label}</p>
                </div>
              </div>
            </div>

            {/* 원형 게이지 */}
            <div className="relative w-32 h-32">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="#E5E7EB"
                  strokeWidth="10"
                  fill="none"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke={scoreInfo.color}
                  strokeWidth="10"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 56}`}
                  strokeDashoffset={`${2 * Math.PI * 56 * (1 - healthScore / 100)}`}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 1s ease' }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs text-gray-500">100점 만점</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 산정 기준 모달 */}
      <ScoreCriteriaModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

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