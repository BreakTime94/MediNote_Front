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
        medications: [],
        searchKeyword: "",
        searchResults: [],
        height: "",
        weight: "",
        bloodPressureSystolic: "",
        bloodPressureDiastolic: "",
        bloodSugar: "",
        sleepHours: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    // 약품 검색
    const handleSearch = async (e) => {
        const keyword = e.target.value;
        setForm({ ...form, searchKeyword: keyword });

        if (keyword.length > 1) {
            try {
                const res = await axios.get(
                    `http://localhost:8081/api/health/medication/search?keyword=${keyword}`
                );
                const results = Array.isArray(res.data)
                    ? res.data
                    : res.data.content || [];
                setForm((prev) => ({ ...prev, searchResults: results }));
            } catch (err) {
                console.error("검색 실패", err);
            }
        } else {
            setForm((prev) => ({ ...prev, searchResults: [] }));
        }
    };

    // 약품 추가
    const addMedication = (med) => {
        if (
            !form.medications.find(
                (m) => (m.id || m.medicationId) === (med.id || med.medicationId)
            )
        ) {
            setForm((prev) => ({
                ...prev,
                medications: [...prev.medications, med],
                searchKeyword: "",
                searchResults: []
            }));
        }
    };

    // 약품 제거
    const removeMedication = (id) => {
        setForm((prev) => ({
            ...prev,
            medications: prev.medications.filter(
                (m) => (m.id || m.medicationId) !== id
            )
        }));
    };

    // Y/N 라디오 버튼
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
                    />
                    <span>N</span>
                </label>
            </div>
        </div>
    );

    return (

        <form className="p-6 max-w-lg mx-auto bg-white shadow-md rounded-md space-y-6">
            {/* 헤더 */}
            <h2 className="text-2xl font-bold text-center text-pink-500 mb-4">
                내 건강정보 입력
            </h2>
            {/* 성별 */}
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
                    <div className="flex items-center space-x-2">
                        <label className="text-gray-800">주당 음주 횟수</label>
                        <input
                            type="number"
                            name="drinkingPerWeek"
                            value={form.drinkingPerWeek}
                            onChange={handleChange}
                            className="border border-gray-300 rounded-md p-2 w-20"
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <label className="text-gray-800">1회당 음주량</label>
                        <input
                            type="number"
                            name="drinkingPerOnce"
                            value={form.drinkingPerOnce}
                            onChange={handleChange}
                            className="border border-gray-300 rounded-md p-2 w-20"
                        />
                    </div>
                </div>
            )}

            <RadioYN name="chronicDiseaseYn" label="기저질환 여부" />
            <RadioYN name="allergyYn" label="알러지 여부" />
            <RadioYN name="medicationYn" label="복용약 여부" />

            {form.medicationYn === "Y" && (
                <div className="flex flex-col ml-4 space-y-2">
                    <label className="text-gray-800 mb-1">복용약 검색</label>
                    <input
                        type="text"
                        value={form.searchKeyword}
                        onChange={handleSearch}
                        placeholder="약품명을 입력하세요"
                        className="border border-gray-300 rounded-md p-2"
                    />

                    {/* 검색 결과 */}
                    {form.searchResults.length > 0 && (
                        <ul className="border rounded bg-white max-h-40 overflow-y-auto">
                            {form.searchResults.map((med) => (
                                <li
                                    key={med.id || med.medicationId}
                                    onClick={() => addMedication(med)}
                                    className="p-2 hover:bg-gray-100 cursor-pointer"
                                >
                                    {med.nameKo} ({med.company})
                                </li>
                            ))}
                        </ul>
                    )}

                    {/* 선택된 약품 */}
                    <div className="flex flex-wrap gap-2 mt-2">
                        {form.medications.map((med) => (
                            <span
                                key={med.id || med.medicationId}
                                className="bg-pink-200 text-sm px-2 py-1 rounded flex items-center space-x-1"
                            >
                <span>{med.nameKo}</span>
                <button
                    type="button"
                    onClick={() =>
                        removeMedication(med.id || med.medicationId)
                    }
                    className="text-red-600"
                >
                  ✕
                </button>
              </span>
                        ))}
                    </div>
                </div>
            )}

            {/* 신체 수치 */}
            <div className="flex items-center space-x-2 mb-4">
                <label className="text-gray-700 font-semibold">키 :</label>
                <input
                    type="number"
                    name="height"
                    value={form.height}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-md p-2 w-20"
                />
                <span>cm</span>
            </div>

            <div className="flex items-center space-x-2 mb-4">
                <label className="text-gray-700 font-semibold">체중 :</label>
                <input
                    type="number"
                    name="weight"
                    value={form.weight}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-md p-2 w-20"
                />
                <span>kg</span>
            </div>

            <div className="flex items-center space-x-2 mb-4">
                <label className="text-gray-700 font-semibold">혈압 :</label>
                <input
                    type="number"
                    name="bloodPressureSystolic"
                    value={form.bloodPressureSystolic}
                    onChange={handleChange}
                    placeholder="수축기"
                    className="border border-gray-300 rounded-md p-2 w-20"
                />
                <span>/</span>
                <input
                    type="number"
                    name="bloodPressureDiastolic"
                    value={form.bloodPressureDiastolic}
                    onChange={handleChange}
                    placeholder="이완기"
                    className="border border-gray-300 rounded-md p-2 w-20"
                />
                <span>mmHg</span>
            </div>

            <div className="flex items-center space-x-2 mb-4">
                <label className="text-gray-700 font-semibold">혈당 :</label>
                <input
                    type="number"
                    name="bloodSugar"
                    value={form.bloodSugar}
                    onChange={handleChange}
                    placeholder="예: 90"
                    className="border border-gray-300 rounded-md p-2 w-20"
                />
                <span>mg/dL</span>
            </div>

            <div className="flex items-center space-x-2 mb-4">
                <label className="text-gray-700 font-semibold">수면 시간 :</label>
                <input
                    type="number"
                    name="sleepHours"
                    value={form.sleepHours}
                    onChange={handleChange}
                    placeholder="예: 7"
                    className="border border-gray-300 rounded-md p-2 w-20"
                />
                <span>시간</span>
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
