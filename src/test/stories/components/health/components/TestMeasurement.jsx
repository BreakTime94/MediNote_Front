import React, { useState } from "react";
import axios from "axios";

function TestMeasurement() {
    const [form, setForm] = useState({
        gender: "",
        smoking: "",
        drinking: "",
        drinkingPerWeek: "",
        drinkingPerOnce: "",
        chronicDiseaseYn: "",
        chronicDiseaseDetail: "",
        allergyYn: "",
        allergyDetail: "",
        medicationYn: "",
        medicationDetail: "",
        height: "",
        weight: "",
        bloodPressureSystolic: "",
        bloodPressureDiastolic: "",
        bloodSugar: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // ✅ Gateway 주소로 호출 (8080)
            const response = await axios.post(
                "http://localhost:8080/api/health/measurement",
                form,
                {
                    headers: { "X-Member-Id": 1 }, // 로그인된 사용자 ID 임시
                }
            );
            alert("id 저장 성공 : " + response.data);
        } catch (error) {
            console.error("🚨 API 호출 에러:", error);
            if (error.response) {
                console.error("응답 코드:", error.response.status);
                console.error("응답 데이터:", error.response.data);
            } else if (error.request) {
                console.error("요청은 갔지만 응답 없음:", error.request);
            } else {
                console.error("요청 설정 중 에러:", error.message);
            }
            alert("Id 저장 실패");
        }
    };

    // 공통 Radio 컴포넌트
    const RadioYN = ({ name, label }) => (
        <div className="flex flex-col mb-4">
            <span className="text-gray-700 font-semibold mb-1">{label}</span>
            <div className="flex space-x-4">
                <label className="flex items-center space-x-1">
                    <input
                        type="radio"
                        name={name}
                        value="Y"
                        checked={form[name] === "Y"}
                        onChange={handleChange}
                        className="text-primary-500 focus:ring-primary-500"
                    />
                    <span>Y</span>
                </label>
                <label className="flex items-center space-x-1">
                    <input
                        type="radio"
                        name={name}
                        value="N"
                        checked={form[name] === "N"}
                        onChange={handleChange}
                        className="text-primary-500 focus:ring-primary-500"
                    />
                    <span>N</span>
                </label>
            </div>
        </div>
    );

    return (
        <form
            onSubmit={handleSubmit}
            className="p-6 max-w-lg mx-auto bg-white shadow-md rounded-md space-y-6"
        >
            <div className="flex flex-col">
                <label className="text-gray-700 font-semibold mb-1">성별 :</label>
                <select
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    required
                    className="border border-gray-300 rounded-md p-2 focus:ring-purple-400"
                >
                    <option value="">선택</option>
                    <option value="MALE">남성</option>
                    <option value="FEMALE">여성</option>
                    <option value="OTHER">그외</option>
                </select>
            </div>

            <RadioYN name="smoking" label="흡연 여부" />
            <RadioYN name="drinking" label="음주 여부" />

            {form.drinking === "Y" && (
                <div className="ml-4 space-y-3">
                    <div className="flex flex-col">
                        <label className="text-gray-800 mb-1">주당 음주 횟수</label>
                        <input
                            type="number"
                            name="drinkingPerWeek"
                            value={form.drinkingPerWeek}
                            onChange={handleChange}
                            className="border border-gray-300 rounded-md p-2 focus:ring-purple-400"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-gray-800 mb-1">1회당 음주량</label>
                        <input
                            type="number"
                            name="drinkingPerOnce"
                            value={form.drinkingPerOnce}
                            onChange={handleChange}
                            className="border border-gray-300 rounded-md p-2 focus:ring-purple-400"
                        />
                    </div>
                </div>
            )}

            <RadioYN name="chronicDiseaseYn" label="기저질환 여부" />
            <RadioYN name="allergyYn" label="알러지 여부" />
            <RadioYN name="medicationYn" label="복용약 여부" />

            <div className="flex flex-col mb-4">
                <div className="flex items-center space-x-2">
                    <label className="text-gray-700 font-semibold mb-1">키 :</label>
                    <input
                        type="number"
                        name="height"
                        value={form.height}
                        onChange={handleChange}
                        min="0"
                        className="border border-gray-300 rounded-md p-2 w-28 focus:ring-purple-400"
                    />
                    <span className="text-gray-700">cm</span>
                </div>
            </div>

            <div className="flex flex-col mb-4">
                <div className="flex items-center space-x-2">
                    <label className="text-gray-700 font-semibold mb-1">체중 :</label>
                    <input
                        type="number"
                        name="weight"
                        value={form.weight}
                        onChange={handleChange}
                        min="0"
                        className="border border-gray-300 rounded-md p-2 w-28 focus:ring-purple-400"
                    />
                    <span className="text-gray-700">kg</span>
                </div>
            </div>

            <div className="flex flex-col mb-4">
                <div className="flex items-center space-x-2">
                    <label className="text-gray-700 font-semibold mb-1">혈압 :</label>
                    <input
                        type="number"
                        name="bloodPressureSystolic"
                        value={form.bloodPressureSystolic}
                        onChange={handleChange}
                        min="0"
                        placeholder="수축기"
                        className="border border-gray-300 rounded-md p-2 w-28 focus:ring-purple-400"
                    />
                    <span className="text-gray-700">mmHg</span>
                    <div className="flex items-center space-x-2">
                        <input
                            type="number"
                            name="bloodPressureDiastolic"
                            value={form.bloodPressureDiastolic}
                            onChange={handleChange}
                            min="0"
                            placeholder="이완기"
                            className="border border-gray-300 rounded-md p-2 w-28 focus:ring-purple-400"
                        />
                        <span className="text-gray-700">mmHg</span>
                    </div>
                </div>
            </div>

            <div className="flex flex-col mb-4">
                <div className="flex items-center space-x-2">
                    <label className="text-gray-700 font-semibold mb-1">혈당 :</label>
                    <input
                        type="number"
                        name="bloodSugar"
                        value={form.bloodSugar}
                        onChange={handleChange}
                        min="0"
                        placeholder="예 : 90"
                        className="border border-gray-300 rounded-md p-2 w-28 focus:ring-purple-400"
                    />
                    <span className="text-gray-700">mg/dL</span>
                </div>
            </div>

            <div className="flex justify-center">
                <button
                    type="submit"
                    className="flex items-center bg-pink-300 text-white px-12 py-2 rounded hover:bg-pink-400 active:bg-pink-500 cursor-pointer"
                >
                    저장
                </button>
            </div>
        </form>
    );
}

export default TestMeasurement;
