import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/components/common/api/axiosInterceptor.js";
import {MeasurementValidation} from "./MeasurementValidation.jsx";
import { useconditionSearch} from "@/pages/health/useconditionSearch.jsx";

const initialHealthForm = {
  gender: "",
  smoking: false,
  drinking: false,
  drinkingPerWeek: "",
  drinkingPerOnce: "",
  chronicDiseaseYn: false,
  chronicDiseaseIds: [],
  allergyYn: false,
  allergyIds: [],
  medicationYn: false,
  medicationIds: [],
  medications: [],
  searchKeyword: "",
  height: "",
  weight: "",
  bloodPressureSystolic: "",
  bloodPressureDiastolic: "",
  bloodSugar: "",
  sleepHours: "",
};

function Measurement() {
  const [form, setForm] = useState(initialHealthForm);
  const [chronicOptions, setChronicOptions] = useState([]);
  const [allergyOptions, setAllergyOptions] = useState([]);
  const [medicationSearch, setMedicationSearch] = useState(""); //  추가
  const [medicationResults, setMedicationResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const searchTimer = useRef(null);
  const navigate = useNavigate();

  //키워드 검색 훅
  const chronicSearchHook = useconditionSearch(chronicOptions);
  const allergySearchHook = useconditionSearch(allergyOptions);

  //  질환/알러지 전체 불러오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [chronicRes, allergyRes] = await Promise.all([
          api.get("/health/condition/chronicDiseases"),
          api.get("/health/condition/allergies"),
        ]);
        setChronicOptions(chronicRes.data || []);
        setAllergyOptions(allergyRes.data || []);
      } catch (err) {
        console.error("데이터 로딩 실패", err);
      }
    };
    fetchData();
  }, []);

  //  공통 입력
  const handleChange = (e) => {
    const {name, value} = e.target;
    const updatedForm = {...form, [name]: value};
    setForm(updatedForm);

    const newErrors = MeasurementValidation(updatedForm);
    setErrors(newErrors);
  };

  //  복용약 검색 (디바운싱)
  const handleSearchMedication = async (keyword) => {
    if (!keyword.trim()) {
      setMedicationResults([]);
      return;
    }

    if (searchTimer.current) clearTimeout(searchTimer.current); //이전 타이머 초기화

    searchTimer.current = setTimeout(async () => {
      try {
        const res = await api.get(`/health/medication/search?keyword=${keyword}`);
        setMedicationResults(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error(" 약품 검색 실패:", err);
      }
    }, 300);
  };

  //  복용약 선택 → 다중 선택 가능
  const handleSelectMedication = (med) => {
    console.log("선택한 약:", med);

    if (!form.medications) form.medications = [];
    //  id로 중복 체크
    if (form.medications.some((m) => m.id === med.id)) {
      console.log("중복이라 추가 안 함");
      return;
    }

    setForm((prev) => ({
      ...prev,
      medications: [...prev.medications, med],
    }));

    console.log(" 약 추가됨!");
    //  검색어와 결과 모두 유지 (다중 선택 가능)
  };

  //  복용약 삭제
  const handleRemoveMedication = (id) => {
    setForm((prev) => ({
      ...prev,
      medications: prev.medications.filter((m) => m.id !== id), //  medicationId → id
    }));
  };

  //  기저질환 선택 → 검색창 초기화
  const handleSelectChronic = (opt) => {
    if (form.chronicDiseaseIds.includes(opt.id)) return;
    setForm((prev) => ({
      ...prev,
      chronicDiseaseIds: [...prev.chronicDiseaseIds, opt.id],
    }));
    chronicSearchHook.reset();  //검색창 초기화
  };

  //  알러지 선택 → 검색창 초기화
  const handleSelectAllergy = (opt) => {
    if (form.allergyIds.includes(opt.id)) return;
    setForm((prev) => ({
      ...prev,
      allergyIds: [...prev.allergyIds, opt.id],
    }));
    allergySearchHook.reset();
  };

    //  저장
    const handleSubmit = async (e) => {
      e.preventDefault();

      //유효성 검사
      const errors = MeasurementValidation(form);
      if (Object.keys(errors).length > 0) {
        alert(Object.values(errors)[0]); // 첫 번째 오류만 표시
        return;
      }

      if (!window.confirm("건강정보를 등록하시겠습니까?")) return;

      setIsLoading(true);

      const payload = {
        gender: form.gender,
        smoking: form.smoking,
        drinking: form.drinking,
        drinkingPerWeek: form.drinkingPerWeek,
        drinkingPerOnce: form.drinkingPerOnce,
        chronicDiseaseYn: form.chronicDiseaseYn,
        chronicDiseaseIds: form.chronicDiseaseIds,
        allergyYn: form.allergyYn,
        allergyIds: form.allergyIds,
        medicationYn: form.medicationYn,
        medicationIds: form.medications?.map((m) => m.id) || [], //  medicationId → id
        height: form.height,
        weight: form.weight,
        bloodPressureSystolic: form.bloodPressureSystolic,
        bloodPressureDiastolic: form.bloodPressureDiastolic,
        bloodSugar: form.bloodSugar,
        sleepHours: form.sleepHours,
      };

      console.log("보낼 payload ", JSON.stringify(payload, null, 2));

      try {
        await api.post("/health/measurement", payload);
        alert(" 건강정보가 등록되었습니다.");
        navigate("/mycare/list");
        setForm(initialHealthForm);
        setMedicationSearch("");
      } catch (err) {
        console.error("저장 실패:", err);
        alert("저장에 실패했습니다. 다시 시도해주세요.");
      } finally {
        setIsLoading(false);
      }
    };

    return (
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-md">
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-pink-400 to-purple-500 text-transparent bg-clip-text text-center mb-8">
            건강정보 등록
          </h1>

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* 성별 */}
              <div>
                <label className="font-semibold">성별</label>
                <select
                    name="gender"
                    value={form.gender || ""}
                    onChange={handleChange}
                    required
                    className="mt-2 w-full border rounded-lg px-3 py-2"
                >
                  <option value="">선택</option>
                  <option value="MALE">남성</option>
                  <option value="FEMALE">여성</option>
                  <option value="OTHER">기타</option>
                </select>
              </div>

              {/* 흡연 */}
              <div>
                <label className="font-semibold">흡연 여부</label>
                <select
                    name="smoking"
                    value={String(form.smoking)}
                    onChange={(e) =>
                        setForm({...form, smoking: e.target.value === "true"})
                    }
                    className="mt-2 w-full border rounded-lg px-3 py-2"
                >
                  <option value="true">예</option>
                  <option value="false">아니오</option>
                </select>
              </div>

              {/* 음주 */}
              <div>
                <label className="font-semibold">음주 여부</label>
                <select
                    name="drinking"
                    value={String(form.drinking)}
                    onChange={(e) =>
                        setForm({...form, drinking: e.target.value === "true"})
                    }
                    className="mt-2 w-full border rounded-lg px-3 py-2"
                >
                  <option value="true">예</option>
                  <option value="false">아니오</option>
                </select>
              </div>

              {/* 음주 상세 */}
              {form.drinking && (
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">주당 음주 횟수(소주 기준)</label>
                      <input
                          type="number"
                          name="drinkingPerWeek"
                          value={form.drinkingPerWeek || ""}
                          onChange={handleChange}
                          placeholder="횟수"
                          className="border rounded-lg px-3 py-2 w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">1회당 음주량(잔)</label>
                      <input
                          type="number"
                          name="drinkingPerOnce"
                          value={form.drinkingPerOnce || ""}
                          onChange={handleChange}
                          placeholder="잔"
                          className="border rounded-lg px-3 py-2 w-full"
                      />
                    </div>
                  </div>
              )}

              {/*  기저질환 */}
              <div>
                <label className="font-semibold">기저질환 여부</label>
                <select
                    name="chronicDiseaseYn"
                    value={String(form.chronicDiseaseYn)}
                    onChange={(e) =>
                        setForm({...form, chronicDiseaseYn: e.target.value === "true"})
                    }
                    className="mt-2 w-full border rounded-lg px-3 py-2"
                >
                  <option value="true">예</option>
                  <option value="false">아니오</option>
                </select>

                {form.chronicDiseaseYn === true && (
                    <div className="mt-3">
                      <input
                          type="text"
                          placeholder="기저질환 검색"
                          value={chronicSearchHook.keyword}
                          onChange={(e) => chronicSearchHook.handleSearch(e.target.value)}
                          className="border rounded-lg px-3 py-2 w-full"
                      />
                      {chronicSearchHook.results.length > 0 && (
                          <ul className="mt-2 border rounded-lg p-2 bg-gray-50 max-h-40 overflow-y-auto">
                            {chronicSearchHook.results.map((opt) => (
                                <li
                                    key={opt.id}
                                    className="cursor-pointer hover:text-pink-600 py-1"
                                    onClick={() => handleSelectChronic(opt)}
                                >
                                  + {opt.nameKo}
                                </li>
                            ))}
                          </ul>
                      )}
                      <div className="mt-3 flex flex-wrap gap-2">
                        {form.chronicDiseaseIds?.map((id) => {
                          const item = chronicOptions.find((c) => c.id === id);
                          return (
                              <span
                                  key={id}
                                  className="bg-blue-200 text-sm px-2 py-1 rounded flex items-center space-x-1"
                              >
                        {item?.nameKo}
                                <button
                                    type="button"
                                    onClick={() =>
                                        setForm((prev) => ({
                                          ...prev,
                                          chronicDiseaseIds: prev.chronicDiseaseIds.filter(
                                              (x) => x !== id
                                          ),
                                        }))
                                    }
                                    className="text-red-500"
                                >
                          ✕
                        </button>
                      </span>
                          );
                        })}
                      </div>
                    </div>
                )}
              </div>

              {/*  알러지 */}
              <div>
                <label className="font-semibold">알러지 여부</label>
                <select
                    name="allergyYn"
                    value={String(form.allergyYn)}
                    onChange={(e) =>
                        setForm({...form, allergyYn: e.target.value === "true"})
                    }
                    className="mt-2 w-full border rounded-lg px-3 py-2"
                >
                  <option value="true">예</option>
                  <option value="false">아니오</option>
                </select>

                {form.allergyYn === true && (
                    <div className="mt-3">
                      <input
                          type="text"
                          placeholder="알러지 검색"
                          value={allergySearchHook.keyword}
                          onChange={(e) => allergySearchHook.handleSearch(e.target.value)}
                          className="border rounded-lg px-3 py-2 w-full"
                      />
                      {allergySearchHook.results.length > 0 && (
                          <ul className="mt-2 border rounded-lg p-2 bg-gray-50 max-h-40 overflow-y-auto">
                            {allergySearchHook.results.map((opt) => (
                                <li
                                    key={opt.id}
                                    className="cursor-pointer hover:text-pink-600 py-1"
                                    onClick={() => handleSelectAllergy(opt)}
                                >
                                  + {opt.nameKo}
                                </li>
                            ))}
                          </ul>
                      )}
                      <div className="mt-3 flex flex-wrap gap-2">
                        {form.allergyIds?.map((id) => {
                          const item = allergyOptions.find((a) => a.id === id);
                          return (
                              <span
                                  key={id}
                                  className="bg-green-200 text-sm px-2 py-1 rounded flex items-center space-x-1"
                              >
                        {item?.nameKo}
                                <button
                                    type="button"
                                    onClick={() =>
                                        setForm((prev) => ({
                                          ...prev,
                                          allergyIds: prev.allergyIds.filter((x) => x !== id),
                                        }))
                                    }
                                    className="text-red-500"
                                >
                          ✕
                        </button>
                      </span>
                          );
                        })}
                      </div>
                    </div>
                )}
              </div>

              {/* 복용약 */}
              <div>
                <label className="font-semibold">복용약 여부</label>
                <select
                    name="medicationYn"
                    value={String(form.medicationYn)}
                    onChange={(e) =>
                        setForm({...form, medicationYn: e.target.value === "true"})
                    }
                    className="mt-2 w-full border rounded-lg px-3 py-2"
                >
                  <option value="true">예</option>
                  <option value="false">아니오</option>
                </select>

                {form.medicationYn === true && (
                    <div className="mt-3">
                      <input
                          type="text"
                          placeholder="복용약 검색"
                          value={medicationSearch}
                          onChange={(e) => {
                            setMedicationSearch(e.target.value);
                            handleSearchMedication(e.target.value);
                          }}
                          className="border rounded-lg px-3 py-2 w-full"
                      />

                      {/*  검색어가 있고 결과가 있을 때만 표시 */}
                      {medicationSearch.length > 0 && medicationResults.length > 0 && (
                          <ul className="mt-2 border rounded-lg p-2 bg-gray-50 max-h-40 overflow-y-auto">
                            {medicationResults.map((med) => (
                                <li
                                    key={med.id} //  medicationId → id
                                    className="cursor-pointer hover:text-pink-600 py-1"
                                    onClick={() => handleSelectMedication(med)}
                                >
                                  + {med.nameKo} {med.company && `(${med.company})`}
                                </li>
                            ))}
                          </ul>
                      )}

                      {/* 선택된 복용약 표시 */}
                      <div className="mt-3 flex flex-wrap gap-2">
                        {form.medications?.map((m) => (
                            <span
                                key={m.id} //  medicationId → id
                                className="bg-purple-200 text-sm px-2 py-1 rounded flex items-center space-x-1"
                            >
                            {m.nameKo}
                              <button
                                  type="button"
                                  onClick={() => handleRemoveMedication(m.id)} //  medicationId → id
                                  className="text-red-500"
                              >
                              ✕
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                )}
              </div>

              {/* 신체정보 */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">키 (cm)</label>
                  <input
                      type="number"
                      name="height"
                      value={form.height || ""}
                      onChange={handleChange}
                      placeholder="169"
                      className={`border rounded-lg px-3 py-2 w-full ${errors.height ? "border-red-400" : ""}`}
                  />
                  {errors.height && (
                      <p className="text-red-500 text-sm mt-1">{errors.height}</p>
                  )}
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">체중 (kg)</label>
                  <input
                      type="number"
                      name="weight"
                      value={form.weight || ""}
                      onChange={handleChange}
                      placeholder="73"
                      className={`border rounded-lg px-3 py-2 w-full ${errors.weight ? "border-red-400" : ""}`}
                  />
                  {errors.weight && (
                      <p className="text-red-500 text-sm mt-1">{errors.weight}</p>
                  )}
                </div>
              </div>

              {/* 혈압/혈당 */}
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">수축기 혈압</label>
                  <input
                      type="number"
                      name="bloodPressureSystolic"
                      value={form.bloodPressureSystolic || ""}
                      onChange={handleChange}
                      placeholder="118"
                      className={`border rounded-lg px-3 py-2 w-full ${errors.bloodPressureSystolic ? "border-red-400" : ""}`}
                  />
                  {errors.bloodPressureSystolic && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.bloodPressureSystolic}
                      </p>
                  )}
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">이완기 혈압</label>
                  <input
                      type="number"
                      name="bloodPressureDiastolic"
                      value={form.bloodPressureDiastolic || ""}
                      onChange={handleChange}
                      placeholder="81"
                      className={`border rounded-lg px-3 py-2 w-full ${errors.bloodPressureDiastolic ? "border-red-400" : ""}`}
                  />
                  {errors.bloodPressureDiastolic && (
                      <p className="text-red-500 text-sm mt-1">{errors.bloodPressureDiastolic}</p>
                  )}
                  {errors.bloodPressure && (<p className="text-red-500 text-sm mt-1">{errors.bloodPressure}</p>)}
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">혈당 (mg/dL)</label>
                  <input
                      type="number"
                      name="bloodSugar"
                      value={form.bloodSugar || ""}
                      onChange={handleChange}
                      placeholder="90"
                      className={`border rounded-lg px-3 py-2 w-full ${errors.bloodSugar ? "border-red-400" : ""}`}
                  />
                  {errors.bloodSugar && (<p className="text-red-500 text-sm mt-1">{errors.bloodSugar}</p>)}
                </div>
              </div>

              {/* 수면 */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">수면 시간(h)</label>
                <input
                    type="number"
                    name="sleepHours"
                    value={form.sleepHours || ""}
                    onChange={handleChange}
                    placeholder="7"
                    className={`border rounded-lg px-3 py-2 w-full ${errors.sleepHours ? "border-red-400" : ""}`}
                />
                {errors.sleepHours && (<p className="text-red-500 text-sm mt-1">{errors.sleepHours}</p>)}

              </div>
            </div>

            {/* 버튼 */}
            <div className="flex justify-center mt-10 space-x-4">
              <button
                  type="submit"
                  disabled={isLoading}
                  className={`px-6 py-2 rounded-lg text-white font-semibold bg-gradient-to-r from-pink-400 to-purple-500 hover:opacity-90 transition ${
                      isLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
              >
                {isLoading ? "등록 중..." : "등록"}
              </button>
            </div>
          </form>
        </div>
    );

}

export default Measurement;