// import React from "react";
// import {
//   LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer,
//   RadialBarChart, RadialBar, Legend
// } from "recharts";
//
// // -----------------------------
// // 더미 데이터 (실제 연결 시 API 값으로 교체)
// // -----------------------------
// const bmiData = [
//   { name: "현재", value: 22 },
//   { name: "정상", value: 24 },
// ];
// const bpData = [
//   { name: "수축기", value: 135 },
//   { name: "이완기", value: 85 },
// ];
// const sugarData = [
//   { name: "현재", value: 90 },
//   { name: "정상", value: 100 },
// ];
// const healthScoreData = [{ name: "점수", uv: 82, fill: "#93c5fd" }]; // 파란 파스텔
//
// export default function HealthDashboard() {
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
//           {/* BMI */}
//           <div className="bg-white rounded-2xl shadow-md p-4 flex flex-col items-center">
//             <h3 className="text-lg font-semibold mb-2 text-[#7c4dff]">체중 (BMI)</h3>
//             <ResponsiveContainer width="100%" height={180}>
//               <LineChart data={bmiData}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
//                 <XAxis dataKey="name" />
//                 <YAxis domain={[0, 30]} />
//                 <Tooltip formatter={(v) => [`${v}`, "BMI"]} />
//                 <Line type="monotone" dataKey="value" stroke="#c084fc" strokeWidth={3} dot={{ r: 6 }} />
//                 <ReferenceLine
//                     y={bmiAvg}
//                     label={{ value: `평균 ${bmiAvg}`, position: "right", fill: "#a78bfa", fontSize: 12 }}
//                     stroke="#a78bfa"
//                     strokeDasharray="5 5"
//                 />
//               </LineChart>
//             </ResponsiveContainer>
//             <p className="text-sm mt-2 text-gray-600">현재: {bmiData[0].value} / 평균: {bmiAvg}</p>
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
