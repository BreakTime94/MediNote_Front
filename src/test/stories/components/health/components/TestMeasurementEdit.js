import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import api from "./axiosInterceptor.js";
import dayjs from "dayjs";


function TestMeasurementEdit(props) {
  const {id} = useParams(); //id 추출
  const navigate = useNavigate(); //수정 후 리스트로 리다이렉트
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);

  /* 페이지 진입 시 1회 실행 마운트/id 변경 시 실행 */
  useEffect( () => {
    fetchMeasurement();
  }, [id]);

  const fetchMeasurement = async () => {
    try {
      // axiosInterceptor를 통해 JWT 자동 포함 요청
      const res = await api.get(`/health/measurement/${id}`);
      setForm(res.data);  //받아온 데이터 form 저장
    }catch (err) {
      console.error("데이터 조회 실패", err);
      alert("데이터 불러 올 수 없습니다.");
    }finally {
      setLoading(false);  //로딩해제
    }
  };

  /*input, select 변경 시 상태 업데이트 */
  const handleChange = (e) => {
    const { name, value } = e.target;

    // form이 아직 null일 경우에도 안전하게 복사
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* 새 이력 저장 (수정 시 insert) */
  const handleSaveNewVersion = async () => {
    if(!window.confirm("수정하시겠습니까? \n 새 이력으로 저장됩니다.")) return;

    try{
      // POST /health/measurement/update 요청
      await api.post(`/health/measurement/update`, form);
      alert("새로운 건강정보가 추가되었습니다.");
      navigate("/health/measurement/list");
    }catch (err) {
      console.error("저장 실패: " , err);
      alert("저장에 실패하였습니다.");
    }
  };

  /*논리삭제(status=INACTIVE로 변경) */
  const handleDeactivate = async () => {
    if(!window.confirm("이 건강정보를 삭제하시겠습니까?")) return;

    try{
      // PATCH /health/measurement/{id}/deactivate 호출
      await api.patch(`/health/measurement/${id}/deactivate`);  //전체 데이터를 보내지 않고, 일부만 수정할 때 사용
      alert("해당 건강정보가 삭제(비활성화)되었습니다.");
      navigate("/health/measurement/list");
    }catch (err) {
      console.error("삭제 실패: ", err);
      alert("삭제 중 오류 발생하였습니다.");
    }
  };

  //데이터 로딩중일 때
  if(loading)
    return (
      <p className="text-gray-500 text-center mt-10">
        데이터 불러오는 중
      </p>
    );

  //데이터 없을 때
  if(!form)
    return(
      <p className="text-gray-500 text-center mt-10">
        데이터가 존재하지 않습니다.
      </p>
    );

  /*실제 화면 렌더링 부분*/
  return(
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-md">
      {/*제목*/}
      <h1 className="text-3xl font-extrabold bg-gradient-to-r from-pink-400 to-purple-500 text-transparent bg-clip-text text-center mb-8">
        건강정보 수정/삭제
      </h1>

      {/* 입력 폼 전체 */}
      <div className="space-y-6">
        {/* 성별 */}
        <div>
          <label className="font-semibold text-gray-700">성별</label>
          <select
            name="gender"
            value={form.gender || ""}
            onChange={handleChange}
            className="mt-2 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
          >
            <option value="">선택</option>
            <option value="MALE">남성</option>
            <option value="FEMALE">여성</option>
          </select>
        </div>

        {/* 흡연 */}
        <div>
          <label className="font-semibold text-gray-700">흡연 여부</label>
          <select
            name="smoking"
            value={form.smoking ? "true" : "false"}
            onChange={(e) =>
              setForm({ ...form, smoking: e.target.value === "true" })
            }
            className="mt-2 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
          >
            <option value="true">예</option>
            <option value="false">아니오</option>
          </select>
        </div>

        {/* 음주 */}
        <div>
          <label className="font-semibold text-gray-700">음주 여부</label>
          <select
            name="drinking"
            value={form.drinking ? "true" : "false"}
            onChange={(e) =>
              setForm({ ...form, drinking: e.target.value === "true" })
            }
            className="mt-2 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
          >
            <option value="true">예</option>
            <option value="false">아니오</option>
          </select>
        </div>

        {/* 음주 상세 */}
        {form.drinking && (
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="font-semibold text-gray-700">주당 음주 횟수</label>
              <input
                type="number"
                name="drinkingPerWeek"
                value={form.drinkingPerWeek || ""}
                onChange={handleChange}
                className="mt-2 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300"
              />
            </div>
            <div>
              <label className="font-semibold text-gray-700">1회 음주량</label>
              <input
                type="number"
                name="drinkingPerOnce"
                value={form.drinkingPerOnce || ""}
                onChange={handleChange}
                className="mt-2 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300"
              />
            </div>
          </div>
        )}

        {/* 신체 정보 */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="font-semibold text-gray-700">키 (cm)</label>
            <input
              type="number"
              name="height"
              value={form.height || ""}
              onChange={handleChange}
              className="mt-2 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
          </div>
          <div>
            <label className="font-semibold text-gray-700">체중 (kg)</label>
            <input
              type="number"
              name="weight"
              value={form.weight || ""}
              onChange={handleChange}
              className="mt-2 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
          </div>
        </div>

        {/* 혈압 / 혈당 */}
        <div className="grid grid-cols-3 gap-6">
          <div>
            <label className="font-semibold text-gray-700">수축기 혈압</label>
            <input
              type="number"
              name="bloodPressureSystolic"
              value={form.bloodPressureSystolic || ""}
              onChange={handleChange}
              className="mt-2 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
          </div>
          <div>
            <label className="font-semibold text-gray-700">이완기 혈압</label>
            <input
              type="number"
              name="bloodPressureDiastolic"
              value={form.bloodPressureDiastolic || ""}
              onChange={handleChange}
              className="mt-2 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
          </div>
          <div>
            <label className="font-semibold text-gray-700">혈당</label>
            <input
              type="number"
              name="bloodSugar"
              value={form.bloodSugar || ""}
              onChange={handleChange}
              className="mt-2 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
          </div>
        </div>

        {/* 측정일 */}
        <div>
          <label className="font-semibold text-gray-700">측정일</label>
          <p className="mt-2 w-full border rounded-lg px-3 py-2 bg-gray-50 text-gray-600">
            {dayjs(form.measuredDate).format("YYYY-MM-DD HH:mm")}
          </p>
        </div>
      </div>

      {/* 버튼 영역 */}
      <div className="flex justify-center mt-10 space-x-4">
        <button
          onClick={handleSaveNewVersion}
          className="px-6 py-2 rounded-lg text-white font-semibold bg-gradient-to-r from-pink-400 to-purple-500 hover:opacity-90 transition"
        >
          수정(새 이력 저장)
        </button>

        <button
          onClick={handleDeactivate}
          className="px-6 py-2 rounded-lg font-semibold text-red-500 border border-red-300 hover:bg-red-50 transition"
        >
          삭제(비활성화)
        </button>
      </div>
    </div>
  );
}

export default TestMeasurementEdit;