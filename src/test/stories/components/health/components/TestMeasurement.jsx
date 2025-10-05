import React, {useEffect, useState, useRef} from "react";
import api from "./axiosInterceptor.js";

//변수로 뺌
const initialHealthForm = {
  gender: "",
  smoking: "",
  drinking: "",
  drinkingPerWeek: "",
  drinkingPerOnce: "",
  chronicDiseaseYn: "",
  chronicDiseaseIds: [],
  allergyYn: "",
  allergyIds: [],
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
}

function TestMeasurement() {

  const [form, setForm] = useState(initialHealthForm);
  const [chronicOptions, setChronicOptions] = useState([]);
  const [allergyOptions, setAllergyOptions] = useState([]);
  const [chronicSearch, setChronicSearch] = useState("");
  const [allergySearch, setAllergySearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState("");
  const searchTimer = useRef(null);

  //기저질환, 알러지 목록 불러오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [chronicRes, allergyRes] = await Promise.all([
          api.get("/health/condition/chronicDiseases"),
          api.get("/health/condition/allergies")
        ]);
        setChronicOptions(chronicRes.data);
        setAllergyOptions(allergyRes.data);
      } catch (err) {
        console.error("데이터 로딩 실패", err);
        setError("데이터를 불러오는데 실패했습니다. 새로고침해주세요.");
      }
    };

    fetchData();
  }, []);

  //공통입력핸들러
  const handleChange = (e) => {
    const {name, value} = e.target;
    setForm(prev => ({...prev, [name]: value}));
  };

  // 복용약 검색 (디바운싱 적용)
  const handleSearch = (e) => {
    const keyword = e.target.value;
    setForm(prev => ({...prev, searchKeyword: keyword}));

    // 이전 타이머 취소
    if (searchTimer.current) clearTimeout(searchTimer.current);


    if (keyword.length > 1) {
      // 300ms 후에 검색 실행
      searchTimer.current = setTimeout(async () => {
        try {
          const res = await api.get(`/health/medication/search`, {params: {keyword}});
          const results = Array.isArray(res.data) ? res.data : [];
          setForm(prev => ({...prev, searchResults: results}));
        } catch (err) {
          console.error("검색 실패", err);
        } finally {
            setIsSearching(false);
        }
      }, 300);
    } else {
      setForm(prev => ({...prev, searchResults: []}));
    }
  };

  // 복용약 추가
  const addMedication = (med) => {
    if (
        !form.medications.find(
            (m) => (m.id || m.medicationId) === (med.id || med.medicationId)
        )) {
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
          (m) => (m.id || m.medicationId) !== id )
    }));
  };

  //기저질환, 알러지 선택 토글
  const toggleSelection = (field, id) => {
    setForm((prev) => {
      const exists = prev[field].includes(id);
      return {
        ...prev,
        [field]: exists
            ? prev[field].filter(x => x !== id)
            : [...prev[field], id]
      };
    });
  };

  //저장핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const payload = {
      gender: form.gender,
      smoking: form.smoking === "Y",
      drinking: form.drinking === "Y",
      drinkingPerWeek: form.drinkingPerWeek,
      drinkingPerOnce: form.drinkingPerOnce,
      chronicDiseaseYn: form.chronicDiseaseYn === "Y",
      chronicDiseaseIds: form.chronicDiseaseIds,
      allergyYn: form.allergyYn === "Y",
      allergyIds: form.allergyIds,
      medicationYn: form.medicationYn === "Y",
      medications: form.medications.map((m) => m.id || m.medicationId),
      height: form.height,
      weight: form.weight,
      bloodPressureSystolic: form.bloodPressureSystolic,
      bloodPressureDiastolic: form.bloodPressureDiastolic,
      bloodSugar: form.bloodSugar,
      sleepHours: form.sleepHours
    };

    console.log("보낼 payload 👉", JSON.stringify(payload, null, 2));

    try {
      const res = await api.post("/health/measurement", payload);
      alert("저장성공");
      console.log("저장 성공:", res.data);

      // 폼 초기화
      setForm(initialHealthForm);
      setChronicSearch("");
      setAllergySearch("");

    } catch (err) {
      console.error("저장실패: ", err);
      setError("저장에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
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
      <form
          onSubmit={handleSubmit}
          className="p-6 max-w-lg mx-auto bg-white shadow-md rounded-md space-y-6">

        {/* 헤더 */}
        <h2 className="text-2xl font-bold text-center text-pink-500 mb-4">
          내 건강정보 입력
        </h2>

        {/* 에러 메시지 */}
        {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
              {error}
            </div>
        )}

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
                    min={0}
                    max={30}
                    placeholder="0~30"
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
                    min={1}
                    max={20}
                    placeholder="1~20"
                    className="border border-gray-300 rounded-md p-2 w-20"
                />
              </div>
            </div>
        )}

        {/* 기저질환 */}
        <RadioYN name="chronicDiseaseYn" label="기저질환 여부" />
        {form.chronicDiseaseYn === "Y" && (
            <div className="ml-4 space-y-2">
              <label className="text-gray-800 mb-1">기저질환 검색 : </label>
              <input
                  type="text"
                  value={chronicSearch}
                  onChange={(e) => setChronicSearch(e.target.value)}
                  placeholder="보유 질환명을 입력하세요"
                  className="border border-gray-300 rounded-md p-2 w-full"
              />

              {/* 검색 결과 */}
              {chronicSearch.length > 1 && (
                  <ul className="border rounded bg-white max-h-40 overflow-y-auto">
                    {chronicOptions
                        .filter((opt) => opt.nameKo.includes(chronicSearch))
                        .map((opt) => (
                            <li
                                key={opt.id}
                                onClick={() => toggleSelection("chronicDiseaseIds", opt.id)}
                                className="p-2 hover:bg-gray-100 cursor-pointer">
                              {opt.nameKo}
                            </li>
                        ))}
                  </ul>
              )}

              <div className="flex flex-wrap gap-2 mt-2">
                {form.chronicDiseaseIds.map((id) => {
                  const item = chronicOptions.find((c) => c.id === id);
                  return(
                      <span
                          key={id}
                          className="bg-blue-200 text-sm px-2 py-1 rounded flex items-center space-x-1">
                      {item?.nameKo}
                        <button
                            type="button"
                            onClick={() => toggleSelection("chronicDiseaseIds", id)}
                            className="text-red-600">
                        ✕
                      </button>
                    </span>
                  );
                })}
              </div>
            </div>
        )}

        {/* 알러지 */}
        <RadioYN name="allergyYn" label="알러지 여부" />
        {form.allergyYn === "Y" && (
            <div className="ml-4 space-y-2">
              <label className="text-gray-800 mb-1">알러지명 검색 :</label>
              <input
                  type="text"
                  value={allergySearch}
                  onChange={(e) => setAllergySearch(e.target.value)}
                  placeholder="알러지명을 입력하세요"
                  className="border border-gray-300 rounded-md p-2 w-full"
              />

              {allergySearch.length > 1 && (
                  <ul className="border rounded bg-white max-h-40 overflow-y-auto">
                    {allergyOptions
                        .filter((opt) => opt.nameKo.includes(allergySearch))
                        .map((opt) => (
                            <li
                                key={opt.id}
                                onClick={() => toggleSelection("allergyIds", opt.id)}
                                className="p-2 hover:bg-gray-100 cursor-pointer">
                              {opt.nameKo}
                            </li>
                        ))}
                  </ul>
              )}

              <div className="flex flex-wrap gap-2 mt-2">
                {form.allergyIds.map((id) => {
                  const item = allergyOptions.find((a) => a.id === id);
                  return(
                      <span
                          key={id}
                          className="bg-green-200 text-sm px-2 py-1 rounded flex items-center space-x-1">
                        {item?.nameKo}
                        <button
                            type="button"
                            onClick={() => toggleSelection("allergyIds", id)}
                            className="text-red-600">
                          ✕
                        </button>
                      </span>
                  );
                })}
              </div>
            </div>
        )}

        {/* 복용약 */}
        <RadioYN name="medicationYn" label="복용약 여부" />
        {form.medicationYn === "Y" && (
            <div className="flex flex-col ml-4 space-y-2">
              <label className="text-gray-800 mb-1">복용약 검색 :</label>
              <input
                  type="text"
                  value={form.searchKeyword}
                  onChange={handleSearch}
                  placeholder="약품명을 입력하세요"
                  className="border border-gray-300 rounded-md p-2 w-full"
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
              min={1}
              max={500}
              placeholder="예: 65"
              className="border border-gray-300 rounded-md p-2 w-20"
          />
          <span>kg</span>
        </div>

        <div className="flex items-center space-x-2 mb-4">
          <label className="text-gray-700 font-semibold">혈압(수축/이완) :</label>
          <input
              type="number"
              name="bloodPressureSystolic"
              value={form.bloodPressureSystolic}
              onChange={handleChange}
              min={50}
              max={300}
              placeholder="예: 120"
              className="border border-gray-300 rounded-md p-2 w-20"
          />
          <span>/</span>
          <input
              type="number"
              name="bloodPressureDiastolic"
              value={form.bloodPressureDiastolic}
              onChange={handleChange}
              min={30}
              max={200}
              placeholder="예: 80"
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
              min={1}
              max={1000}
              placeholder="예: 90"
              className="border border-gray-300 rounded-md p-2 w-20"
          />
          <span>mg/dL</span>
          <span>mg/dL</span>
        </div>

        <div className="flex items-center space-x-2 mb-4">
          <label className="text-gray-700 font-semibold">수면 시간 :</label>
          <input
              type="number"
              name="sleepHours"
              value={form.sleepHours}
              onChange={handleChange}
              min={0}
              max={24}
              placeholder="예: 7"
              className="border border-gray-300 rounded-md p-2 w-20"
          />
          <span>시간</span>
        </div>

        <div className="flex justify-center">
          <button
              type="submit"
              disabled={isLoading}
              className={`flex items-center bg-pink-300 text-white px-12 py-2 rounded hover:bg-pink-400 active:bg-pink-500 cursor-pointer ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
          >
            {isLoading ? "저장 중..." : "저장"}
          </button>
        </div>
      </form>
  );
}

export default TestMeasurement;