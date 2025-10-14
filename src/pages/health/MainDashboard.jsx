// import React, { useState } from "react";
// import {
//   LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer,
//   RadialBarChart, RadialBar, Legend
// } from "recharts";
//
// // -----------------------------
// // 더미 데이터 (실제 연결 시 API 값으로 교체)
// // -----------------------------
// const bpData = [
//   { name: "수축기", value: 135 },
//   { name: "이완기", value: 85 },
// ];
// const sugarData = [
//   { name: "현재", value: 90 },
//   { name: "정상", value: 100 },
// ];
// const healthScoreData = [{ name: "점수", uv: 82, fill: "#93c5fd" }];
//
// export default function MainDashboard() {
//   console.log('HealthDashboard 렌더링됨!');
//   // BMI 입력 state (백엔드에서 받아올 값)
//   const [height, setHeight] = useState(170);
//   const [weight, setWeight] = useState(65);
//
//   // BMI 카테고리 판단 (UI 표시용)
//   const getBMICategory = (bmi) => {
//     if (bmi < 18.5) return { label: '저체중', color: '#60a5fa' };
//     if (bmi < 23) return { label: '정상', color: '#34d399' };
//     if (bmi < 25) return { label: '과체중', color: '#fbbf24' };
//     if (bmi < 30) return { label: '비만', color: '#fb923c' };
//     return { label: '고도비만', color: '#ef4444' };
//   };
//
//   // BMI 계산 (표시용)
//   const bmi = (weight / ((height / 100) ** 2)).toFixed(1);
//   const category = getBMICategory(parseFloat(bmi));
//   const minHealthyWeight = (18.5 * ((height / 100) ** 2)).toFixed(1);
//   const maxHealthyWeight = (23 * ((height / 100) ** 2)).toFixed(1);
//
//   const bmiAvg = 23;
//   const bpAvg = 120;
//   const sugarAvg = 90;
//   const healthStatusText = "혈압이 살짝 높아요. 물을 충분히 마시고 휴식을 취하세요 💧";
//
//   return (
//       <div className="w-full flex flex-col items-center gap-8 p-8 bg-gradient-to-b from-[#f9f9ff] to-[#f3f4f6] min-h-screen">
//         <h2 className="text-2xl font-bold text-gray-800 mb-2">내 건강 현황</h2>
//
//         {/* === 3개 지표 차트 영역 === */}
//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-6xl">
//
//           {/* BMI - 입력 및 결과 통합 */}
//           <div className="bg-white rounded-2xl shadow-md p-4 flex flex-col items-center">
//             <h3 className="text-lg font-semibold mb-3 text-[#7c4dff]">체중 (BMI)</h3>
//
//             {/* 입력 영역 */}
//             <div className="w-full mb-4 space-y-3">
//               <div>
//                 <label className="block text-xs font-medium text-gray-600 mb-1">
//                   키 (cm): {height}
//                 </label>
//                 <input
//                     type="range"
//                     min="140"
//                     max="200"
//                     value={height}
//                     onChange={(e) => setHeight(Number(e.target.value))}
//                     className="w-full h-1.5 bg-purple-200 rounded-lg appearance-none cursor-pointer"
//                 />
//               </div>
//               <div>
//                 <label className="block text-xs font-medium text-gray-600 mb-1">
//                   체중 (kg): {weight}
//                 </label>
//                 <input
//                     type="range"
//                     min="40"
//                     max="150"
//                     value={weight}
//                     onChange={(e) => setWeight(Number(e.target.value))}
//                     className="w-full h-1.5 bg-purple-200 rounded-lg appearance-none cursor-pointer"
//                 />
//               </div>
//             </div>
//
//             {/* BMI 결과 */}
//             <div className="text-center">
//               <div
//                   className="text-4xl font-bold mb-2"
//                   style={{ color: category.color }}
//               >
//                 {bmi}
//               </div>
//               <div
//                   className="text-sm font-semibold px-3 py-1 rounded-full inline-block mb-2"
//                   style={{ backgroundColor: category.color + '20', color: category.color }}
//               >
//                 {category.label}
//               </div>
//               <p className="text-xs text-gray-500">
//                 권장: {minHealthyWeight} - {maxHealthyWeight}kg
//               </p>
//             </div>
//           </div>
//
//           {/* 혈압 */}
//           <div className="bg-white rounded-2xl shadow-md p-4 flex flex-col items-center">
//             <h3 className="text-lg font-semibold mb-2 text-[#3b82f6]">혈압 (mmHg)</h3>
//             <ResponsiveContainer width="100%" height={180}>
//               <LineChart data={bpData}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
//                 <XAxis dataKey="name" />
//                 <YAxis domain={[60, 160]} />
//                 <Tooltip formatter={(v) => [`${v}`, "mmHg"]} />
//                 <Line type="monotone" dataKey="value" stroke="#93c5fd" strokeWidth={3} dot={{ r: 6 }} />
//                 <ReferenceLine
//                     y={bpAvg}
//                     label={{ value: `평균 ${bpAvg}`, position: "right", fill: "#60a5fa", fontSize: 12 }}
//                     stroke="#60a5fa"
//                     strokeDasharray="5 5"
//                 />
//               </LineChart>
//             </ResponsiveContainer>
//             <p className="text-sm mt-2 text-gray-600">
//               현재: {bpData[0].value}/{bpData[1].value} / 평균: {bpAvg}
//             </p>
//           </div>
//
//           {/* 혈당 */}
//           <div className="bg-white rounded-2xl shadow-md p-4 flex flex-col items-center">
//             <h3 className="text-lg font-semibold mb-2 text-[#10b981]">혈당 (mg/dL)</h3>
//             <ResponsiveContainer width="100%" height={180}>
//               <LineChart data={sugarData}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
//                 <XAxis dataKey="name" />
//                 <YAxis domain={[50, 150]} />
//                 <Tooltip formatter={(v) => [`${v}`, "mg/dL"]} />
//                 <Line type="monotone" dataKey="value" stroke="#86efac" strokeWidth={3} dot={{ r: 6 }} />
//                 <ReferenceLine
//                     y={sugarAvg}
//                     label={{ value: `평균 ${sugarAvg}`, position: "right", fill: "#4ade80", fontSize: 12 }}
//                     stroke="#4ade80"
//                     strokeDasharray="5 5"
//                 />
//               </LineChart>
//             </ResponsiveContainer>
//             <p className="text-sm mt-2 text-gray-600">현재: {sugarData[0].value} / 평균: {sugarAvg}</p>
//           </div>
//         </div>
//
//         {/* === Health Score (원형 게이지) === */}
//         <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center w-full max-w-md">
//           <h3 className="text-lg font-semibold mb-4 text-[#2563eb]">오늘의 Health Score</h3>
//           <ResponsiveContainer width="100%" height={250}>
//             <RadialBarChart
//                 innerRadius="80%"
//                 outerRadius="100%"
//                 barSize={20}
//                 data={healthScoreData}
//                 startAngle={180}
//                 endAngle={0}
//             >
//               <RadialBar
//                   minAngle={15}
//                   background
//                   clockWise
//                   dataKey="uv"
//                   cornerRadius={50}
//               />
//               <Legend
//                   iconSize={0}
//                   layout="vertical"
//                   verticalAlign="middle"
//                   wrapperStyle={{
//                     top: "50%",
//                     left: "50%",
//                     transform: "translate(-50%, -50%)",
//                     textAlign: "center",
//                     lineHeight: "24px",
//                     fontSize: "24px",
//                     fontWeight: "bold",
//                   }}
//                   payload={[{ value: `${healthScoreData[0].uv}점`, color: "#93c5fd" }]}
//               />
//             </RadialBarChart>
//           </ResponsiveContainer>
//           <p className="text-gray-500 text-sm mt-2">100점 만점 기준</p>
//         </div>
//
//         {/* === 건강 요약 문장 === */}
//         <div className="bg-[#fef3c7] rounded-2xl shadow p-4 w-full max-w-3xl text-center">
//           <p className="text-gray-800 font-medium text-base">{healthStatusText}</p>
//         </div>
//       </div>
//   );
// }
