import React, {useEffect, useState} from "react";
import api from "./axiosInterceptor.js";

//변수로 선언
const initialHealthForm = {
  gender: "",
  smoking: "",
  drinking: "",
  drinkingPerWeek: "",
  drinkingPerOnce: "",
  chronicDiseaseYn: "",
  chronicDiseaseDetail: "",
  chronicDiseaseIds: [],
  allergyYn: "",
  allergyDetail: "",
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

  // 기저질환 & 알러지 목록 (검색용)
  const [chronicOptions, setChronicOptions] = useState([]);
  const [allergyOptions, setAllergyOptions] = useState([]);
  const [chronicSearch, setChronicSearch] = useState("");
  const [allergySearch, setAllergySearch] = useState("");

  //기저질환, 알러지 목록 불러오기
  useEffect(() => {
    api
        .get("/health/mlist/chronicDisease")
        .then((res) => setChronicOptions(res.data))
        .catch((err) => console.error("기저질환 리스트 불러오지 못함", err));

    api
        .get("/health/mlist/allergy")
        .then((res) => setAllergyOptions(res.data))
        .catch((err) => console.error("알러지 리스트 불러오지 못함", err));
  }, []);

  //공통입력핸들러
  const handleChange = (e) => {
    const {name, value} = e.target;
    setForm({...form, [name]: value});
  };

  // 약품 검색
  const handleSearch = async (e) => {
    const keyword = e.target.value;
    setForm({...form, searchKeyword: keyword});

    if (keyword.length > 1) { //두글자이상
      try {
        const res = await api.get(
            `/health/medication/search?keyword=${keyword}`
        );
        const results = Array.isArray(res.data)
            ? res.data
            : res.data.content || [];
        setForm((prev) => ({...prev, searchResults: results}));
      } catch (err) {
        console.error("검색 실패", err);
      }
    } else {
      setForm((prev) => ({...prev, searchResults: []}));
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
  //기저질환, 일러지 선택 토글
  const toggleSelection = (field, id) => {
    setForm((prev) => {
      const exists = prev[field].includes(id); //현재 선택되어있는지 확인 field: 상태 필드(chronicDiseaseIds, allergyIds)
      return {
        ...prev, [field]: exists
            ? prev[field].filter((x) => x !== id)   //있으면 제거
            : [...prev[field], id]  //없으면 추가    [field]: [...[1, 3, 5], 7]
      };
    });
  };

  //저장핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      smoking: form.smoking === "Y",
      drinking: form.drinking === "Y",
      chronicDiseaseYn: form.chronicDiseaseYn === "Y",
      allergyYn: form.allergyYn === "Y",
      medicationYn: form.medicationYn === "Y",
      medications: form.medications.map((m) => m.id || m.medicationId)
    };

    try {
      const res = await api.post(
          "/health/measurement",
          payload,
          {headers: {"X-Member-Id": 1}}
        );
        alert("저장성공");
        console.log("저장 성공:", res.data);

      // 폼 초기화
      setForm(initialHealthForm);
      // 검색어도 초기화
      setChronicSearch("");
      setAllergySearch("");

      } catch (err) {
      console.error("저장실패: ", err);
      alert("저장실패ㅠ")
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
        {/* 기저질환 */}
        <RadioYN name="chronicDiseaseYn" label="기저질환 여부" />
        {form.chronicDiseaseYn === "Y" && (
            <div className="ml-4 space-y-2">
              <label className="text-gray-800 mb-1">기저질환 검색</label>
              <input
                type="text"
                value={chronicSearch}
                onChange={(e) => setChronicSearch(e.target.value)}
                placeholder={"보유 질환명을 입력하세요"}
                className="border border-gray-300 rounded-md p-2" />

              {chronicOptions
                .filter( (opt) => opt.nameKo.includes(chronicSearch))
                .map((opt) => (
                  <div
                    key={opt.id}
                    onClick={ () => toggleSelection("chronicDiseaseIds", opt.id)}
                    className="cursor-pointer hover:bg-gray-100 p-1">
                    {opt.nameKo}
                  </div>
                ))}

              <div className="flex flex-wrap gap-2 mt-2">
                {form.chronicDiseaseIds.map((id) => {
                  const item = chronicOptions.find( (c) => c.id === id);
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
              <label className="text-gray-800 mb-1">알러지명 검색</label>
              <input
                type="text"
                value={allergySearch}
                onChange={(e) => setAllergySearch(e.target.value)}
                placeholder="알러지명을 입력하세요"
                className="border border-gray-300 rounded-md p-2" />

              {allergyOptions
                  .filter((opt) => opt.nameKo.includes(allergySearch))
                  .map((opt) => (
                    <div
                      key={opt.id}
                      onClick={() => toggleSelection("allergyIds", opt.id)}
                      className="cursor-pointer hover:bg-gray-100 p-1">
                      {opt.nameKo}
                    </div>
                  ))}

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
