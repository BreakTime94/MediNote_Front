import React, { useEffect, useState, } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "@/components/common/api/axiosInterceptor.js";
import dayjs from "dayjs";

function MeasurementEdit({ id, onMypage }) {
  const navigate = useNavigate();
  const params = useParams();
  const [memberId, setMemberId] = useState(id);

  useEffect(() => {
    if (memberId === null || memberId === undefined) {
      setMemberId(params.id);
    }
  }, [params.id, id]);

  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);

  //  검색 관련 상태
  const [chronicOptions, setChronicOptions] = useState([]);
  const [allergyOptions, setAllergyOptions] = useState([]);
  const [chronicSearch, setChronicSearch] = useState("");
  const [allergySearch, setAllergySearch] = useState("");
  const [medicationResults, setMedicationResults] = useState([]);

  //  등록폼과 동일하게 전체 리스트 1회 로딩
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
        console.error(" 질환/알러지 목록 불러오기 실패:", err);
      }
    };
    fetchData();
  }, []);

  //  데이터 불러오기
  useEffect(() => {
    if (!memberId) return;
    fetchMeasurement();
  }, [memberId]);

  const fetchMeasurement = async () => {
    try {
      const res = await api.get(`/health/measurement/${memberId}`);
      setForm({
        ...res.data,
        chronicDiseaseIds: res.data.chronicDiseaseIds || [],
        allergyIds: res.data.allergyIds || [],
        medications: res.data.medications || [],
      });
      setLoading(false);
    } catch (err) {
      console.error(" 데이터 조회 실패:", err);
      alert("데이터를 불러올 수 없습니다.");
      setLoading(false);
    }
  };

  //  공통 입력
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  //  복용약 검색
  const handleSearchMedication = async (keyword) => {
    if (!keyword.trim()) return;
    try {
      const res = await api.get(`/health/medication/search?keyword=${keyword}`);
      setMedicationResults(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("약 검색 실패:", err);
    }
  };

  //  복용약 선택 → 리스트 및 검색창 초기화
  const handleSelectMedication = (med) => {
    if (!form.medications) form.medications = [];
    if (form.medications.some((m) => m.medicationId === med.medicationId)) return;
    setForm((prev) => ({
      ...prev,
      medications: [...prev.medications, med],
    }));
    setMedicationResults([]); // 리스트 숨김
    document.querySelector("input[placeholder='약 검색']").value = ""; // 검색어 초기화
  };

  //  복용약 삭제
  const handleRemoveMedication = (id) => {
    setForm((prev) => ({
      ...prev,
      medications: prev.medications.filter((m) => m.medicationId !== id),
    }));
  };

  //  기저질환 선택 → 리스트 및 검색창 초기화
  const handleSelectChronic = (opt) => {
    setForm((prev) => ({
      ...prev,
      chronicDiseaseIds: [...(prev.chronicDiseaseIds || []), opt.id],
    }));
    setChronicSearch(""); // 검색어 초기화
  };

  //  알러지 선택 → 리스트 및 검색창 초기화
  const handleSelectAllergy = (opt) => {
    setForm((prev) => ({
      ...prev,
      allergyIds: [...(prev.allergyIds || []), opt.id],
    }));
    setAllergySearch(""); // 검색어 초기화
  };

  //  저장
  const handleSaveNewVersion = async () => {
    if (!window.confirm("수정하시겠습니까?\n새 이력으로 저장됩니다.")) return;

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
      medicationIds: form.medications?.map((m) => m.medicationId) || [],
      height: form.height,
      weight: form.weight,
      bloodPressureSystolic: form.bloodPressureSystolic,
      bloodPressureDiastolic: form.bloodPressureDiastolic,
      bloodSugar: form.bloodSugar,
      sleepHours: form.sleepHours,
    };

    try {
      await api.put(`/health/measurement/update`, payload);
      alert(" 건강정보가 새 이력으로 저장되었습니다.");
      id ? onMypage() : navigate("/health/measurement/list");
    } catch (err) {
      console.error("저장 실패:", err);
      alert("저장에 실패했습니다. 다시 시도해주세요.");
    }
  };

  if (loading || !form)
    return <p className="text-center mt-10 text-gray-500">데이터 불러오는 중...</p>;

  return (
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-md">
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-pink-400 to-purple-500 text-transparent bg-clip-text text-center mb-8">
          건강정보 수정
        </h1>

        <div className="space-y-6">
          {/* 성별 */}
          <div>
            <label className="font-semibold">성별</label>
            <select
                name="gender"
                value={form.gender || ""}
                onChange={handleChange}
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
                    setForm({ ...form, smoking: e.target.value === "true" })
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
                    setForm({ ...form, drinking: e.target.value === "true" })
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
                <input
                    type="number"
                    name="drinkingPerWeek"
                    value={form.drinkingPerWeek || ""}
                    onChange={handleChange}
                    placeholder="주당 횟수"
                    className="border rounded-lg px-3 py-2"
                />
                <input
                    type="number"
                    name="drinkingPerOnce"
                    value={form.drinkingPerOnce || ""}
                    onChange={handleChange}
                    placeholder="1회 음주량"
                    className="border rounded-lg px-3 py-2"
                />
              </div>
          )}

          {/* 기저질환 */}
          <div>
            <label className="font-semibold">기저질환 여부</label>
            <select
                name="chronicDiseaseYn"
                value={String(form.chronicDiseaseYn)}
                onChange={(e) =>
                    setForm({ ...form, chronicDiseaseYn: e.target.value === "true" })
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
                      value={chronicSearch}
                      onChange={(e) => setChronicSearch(e.target.value)}
                      className="border rounded-lg px-3 py-2 w-full"
                  />
                  {chronicSearch.length > 1 && (
                      <ul className="mt-2 border rounded-lg p-2 bg-gray-50 max-h-40 overflow-y-auto">
                        {chronicOptions
                            .filter((opt) => opt.nameKo.includes(chronicSearch))
                            .map((opt) => (
                                <li
                                    key={opt.id}
                                    className="cursor-pointer hover:text-pink-600"
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
                    setForm({ ...form, allergyYn: e.target.value === "true" })
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
                      value={allergySearch}
                      onChange={(e) => setAllergySearch(e.target.value)}
                      className="border rounded-lg px-3 py-2 w-full"
                  />
                  {allergySearch.length > 1 && (
                      <ul className="mt-2 border rounded-lg p-2 bg-gray-50 max-h-40 overflow-y-auto">
                        {allergyOptions
                            .filter((opt) => opt.nameKo.includes(allergySearch))
                            .map((opt) => (
                                <li
                                    key={opt.id}
                                    className="cursor-pointer hover:text-pink-600"
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
                                onClick={() =>
                                    setForm((prev) => ({
                                      ...prev,
                                      allergyIds: prev.allergyIds.filter(
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

          {/*  복용약 */}
          <div>
            <label className="font-semibold">복용약 여부</label>
            <select
                name="medicationYn"
                value={String(form.medicationYn)}
                onChange={(e) =>
                    setForm({ ...form, medicationYn: e.target.value === "true" })
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
                      placeholder="약 검색"
                      onChange={(e) => handleSearchMedication(e.target.value)}
                      className="border rounded-lg px-3 py-2 w-full"
                  />
                  <ul className="mt-2 border rounded-lg p-2 bg-gray-50">
                    {medicationResults.map((med) => (
                        <li
                            key={med.medicationId}
                            className="cursor-pointer hover:text-pink-600"
                            onClick={() => handleSelectMedication(med)}
                        >
                          + {med.nameKo} ({med.company})
                        </li>
                    ))}
                  </ul>

                  <div className="mt-3 space-y-1">
                    {form.medications?.map((m) => (
                        <div
                            key={m.medicationId}
                            className="flex justify-between border px-3 py-1 rounded-md bg-white shadow-sm"
                        >
                          <span>{m.nameKo}</span>
                          <button
                              onClick={() => handleRemoveMedication(m.medicationId)}
                              className="text-red-500 hover:text-red-700"
                          >
                            삭제
                          </button>
                        </div>
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
                  className="border rounded-lg px-3 py-2 w-full"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">체중 (kg)</label>
              <input
                  type="number"
                  name="weight"
                  value={form.weight || ""}
                  onChange={handleChange}
                  placeholder="73"
                  className="border rounded-lg px-3 py-2 w-full"
              />
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
                  className="border rounded-lg px-3 py-2 w-full"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">이완기 혈압</label>
              <input
                  type="number"
                  name="bloodPressureDiastolic"
                  value={form.bloodPressureDiastolic || ""}
                  onChange={handleChange}
                  placeholder="81"
                  className="border rounded-lg px-3 py-2 w-full"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">혈당 (mg/dL)</label>
              <input
                  type="number"
                  name="bloodSugar"
                  value={form.bloodSugar || ""}
                  onChange={handleChange}
                  placeholder="20"
                  className="border rounded-lg px-3 py-2 w-full"
              />
            </div>
          </div>

          {/* 수면 */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">수면 시간 (시간)</label>
            <input
                type="number"
                name="sleepHours"
                value={form.sleepHours || ""}
                onChange={handleChange}
                placeholder="7"
                className="border rounded-lg px-3 py-2 w-full"
            />
          </div>

          {/* 측정일 */}
          <div>
            <label className="font-semibold text-gray-700">측정일</label>
            <p className="mt-2 border rounded-lg px-3 py-2 bg-gray-50">
              {form.measuredDate
                  ? dayjs(form.measuredDate).format("YYYY-MM-DD HH:mm")
                  : "-"}
            </p>
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex justify-center mt-10 space-x-4">
          <button
              onClick={handleSaveNewVersion}
              className="px-6 py-2 rounded-lg text-white font-semibold bg-gradient-to-r from-pink-400 to-purple-500 hover:opacity-90 transition"
          >
            수정(새 이력 저장)
          </button>
        </div>
      </div>
  );
}

export default MeasurementEdit;
