import React, { useState } from "react";
import axios from "axios";

function EmailVerification({ member, setMember, touched, errors, emailStatus, handleBlur, change }) {
  // 📌 추가 상태값
  const [verification, setVerification] = useState(false); // 인증 완료 여부
  const [verificationCode, setVerificationCode] = useState(""); // 사용자가 입력한 코드
  const [showCodeInput, setShowCodeInput] = useState(false); // 코드 입력창 표시 여부

  // 📌 인증메일 요청
  const handleSendVerificationCode = async () => {
    try {
      await axios.post("/api/member/email/send", { email: member.email });
      alert("인증 메일을 발송했습니다. 메일함을 확인하세요.");
      setShowCodeInput(true);
    } catch (err) {
      alert("인증 메일 발송에 실패했습니다.");
    }
  };

  // 📌 인증코드 확인
  const handleVerifyCode = async () => {
    try {
      const res = await axios.post("/api/member/email/verify", {
        email: member.email,
        code: verificationCode,
      });
      if (res.data.status === "VERIFIED") {
        alert("이메일 인증이 완료되었습니다.");
        setVerification(true);
        setShowCodeInput(false);
      } else {
        alert("인증 코드가 올바르지 않습니다.");
      }
    } catch (err) {
      alert("인증 확인 중 오류가 발생했습니다.");
    }
  };

  return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          이메일
        </label>

        {/* 이메일 입력창 (인증 완료되면 disabled 처리) */}
        <input
            id="email"
            name="email"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-100"
            placeholder="이메일을 입력하세요"
            onBlur={handleBlur}
            onChange={(e) => {
              change(e);
              setVerification(false); // 이메일 바꾸면 인증 초기화
              setShowCodeInput(false);
            }}
            value={member.email}
            disabled={verification} // 인증 완료 시 수정 불가
        />

        {/* 인증 메일 요청 버튼 */}
        {!verification && (
            <button
                type="button"
                className="mt-2 w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
                disabled={!!errors.email || !touched.email}
                onClick={handleSendVerificationCode}
            >
              인증메일 요청
            </button>
        )}

        {/* 인증 코드 입력창 + 확인 버튼 */}
        {showCodeInput && !verification && (
            <div className="mt-2 flex space-x-2">
              <input
                  type="text"
                  name="verificationCode"
                  placeholder="인증코드 입력"
                  className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
              />
              <button
                  type="button"
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  onClick={handleVerifyCode}
              >
                확인
              </button>
            </div>
        )}

        {/* 에러 메시지 */}
        {touched.email && errors.email && (
            <ul className="mt-2 text-xs">
              <li className="text-red-500">{errors.email}</li>
            </ul>
        )}

        {/* 중복 검사 메시지 */}
        {touched.email && !errors.email && emailStatus !== "idle" && (
            <ul className="mt-2 text-xs">
              <li
                  className={
                    emailStatus === "available" ? "text-blue-500" : "text-red-500"
                  }
              >
                {emailStatus === "available"
                    ? "사용 가능한 이메일입니다."
                    : "사용하실 수 없는 이메일입니다."}
              </li>
            </ul>
        )}
      </div>
  );
}

export default EmailVerification;
