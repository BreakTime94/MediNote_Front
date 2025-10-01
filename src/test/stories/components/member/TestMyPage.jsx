import React, {useEffect, useState} from "react";
import axios from "axios";
import LogoutButton from "./LogoutButton.jsx";
import {useNavigate} from "react-router-dom";
import {show} from "../common/ui/toast/commonToast.jsx";
import api from "./axiosInterceptor.js";

function TestMyPage() {
  const [memberDto, setMemberDto] = useState({
    email: "",
    nickname: "",
    extraEmail: "",
    profileImagePath: "",
    regDate: ""
  });
  //인증여부
  const[member, setMember] = useState({});
  const [verification, setVerification] = useState(false);
  //인증코드
  const [verificationCode, setVerificationCode] = useState(""); // 사용자가 입력한 코드
  //코드창 보여주기
  const [showCodeInput, setShowCodeInput] = useState(false);
  //읽기전용인지 아닌지(Mypage Component에서 수정도 같이 진행)
  const[readOnly, setReadOnly] = useState(true);
  //라우터 이동
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/api/member/get", {
      withCredentials: true
    })
        .then((res) => {
          console.log("Content-Type", res.headers["content-type"])
          console.log("로그인 된 멤버 정보", res.data)
          setMemberDto(res.data)
        })
        .catch((error) => {
          console.log("error : ", error)
        })
  }, []);

  const logout = (e) => {
    e.preventDefault()

    axios.post("/api/member/auth/logout", {} ,{
      withCredentials: true
    }).then(() => {
      console.log("로그아웃 성공했습니다.");
      navigate("/member")
    }).catch((error) => {
      console.log("error : ", error);
    })
  }


  const updateMember = (e) => {
    e.preventDefault();
    setReadOnly(false);
  }

  const updateDone = (e) => {
    e.preventDefault();
    setReadOnly(true);
  }

  // 인증메일 요청 (then/catch)
  const handleSendVerificationCode = () => {
    api
        .post("/member/email/send", null, {
          params: {email: member.email}
        })
        .then((resp) => {
          show.success({
                title : resp.data.message,
                desc: resp.data.desc
              }
          );
          setShowCodeInput(true);
        })
        .catch(() => {
          show.error({
            title : "인증 메일 발송에 실패했습니다.",
            desc: "잠시 후 다시 시도하여주시기 바랍니다."}
          );
        });
  };

  // 인증코드 확인 (then/catch)
  const handleVerifyCode = () => {
    api
        .post("/member/email/verify", {
          email: member.email,
          code: verificationCode,
        })
        .then((res) => {
          if (res.data.available === true) {
            show.success({title: res.data.message});
            setVerification(true);
            setShowCodeInput(false);
          } else {
            show.formerr({title: "인증 코드가 올바르지 않습니다."});
          }
        })
        .catch(() => {
          show.error({title: "인증 확인 중 오류가 발생했습니다."});
        });
  };

  return(
      <>
        {memberDto &&
        <div className={"flex items-center justify-center min-h-screen"}>
          <div className={"gap-2 w-96 border-1"}>
            <div className={"m-2"}>
              <label className="block text-sm font-medium text-gray-700 mb-1">아이디</label>
              <input className={"border w-full"} name={"email"} id={"name"} value={memberDto.email} readOnly={true} />
            </div>
            <div className={"m-2"}>
              <label className="block text-sm font-medium text-gray-700 mb-1">닉네임</label>
              <input className={"border w-full"} value={memberDto.nickname} readOnly={readOnly}/>
            </div>
            <div className={"m-2"}>
              <label className="block text-sm font-medium text-gray-700 mb-1">추가이메일</label>
              <input className={"border w-full"} value={memberDto.extraEmail} readOnly={readOnly}/>
              {/* 인증 메일 요청 버튼 */}
              {!readOnly && !verification && (
                  <button
                      type="button"
                      className="mt-2 w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                      onClick={handleSendVerificationCode}>
                    인증메일 요청
                  </button>
              )}

              {/* 인증 코드 입력창 + 확인 버튼 */}
              {!readOnly && showCodeInput && !verification && (
                  <div className="mt-2 flex space-x-2">
                    <input
                        type="text"
                        name="verificationCode"
                        placeholder="인증코드 입력"
                        className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400  disabled:bg-gray-200"
                        disabled={verification}
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                    />
                    <button
                        type="button"
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-amber-100"
                        disabled={verification}
                        onClick={handleVerifyCode}
                    >
                      확인
                    </button>
                  </div>
              )}
              {!showCodeInput && verification && (
                  <ul className="mt-2 text-xs">
                    <li className="text-blue-500">이메일 인증이 완료되었습니다.</li>
                  </ul>
              )}
              {member.extraEmail && member.email === member.extraEmail &&
                  (<ul className={"mt-2 text-xs"}>
                    <li className={"text-red-500"}>추가 이메일과 같은 이메일을 사용하실 수 없습니다.</li>
                  </ul>)}
            </div>
            <div className={"m-2"}>
              <label className="block text-sm font-medium text-gray-700 mb-1">프로필이미지</label>
              <input className={"border w-full"} value={memberDto.profileImagePath || "이미지가 없습니다."} readOnly={readOnly}/>
            </div>
            <div className={"m-2"}>
              <label className="block text-sm font-medium text-gray-700 mb-1">계정등록일</label>
              <input className={"border w-full"} value={memberDto.regDate} readOnly={true}/>
            </div>
            {readOnly && (<div className={"m-2"}>
              <LogoutButton children = {"로그아웃"} onClick={logout} />
            </div>)}
            <div  className={"m-2"}>
              {readOnly &&
                (<button type={"button"} className="flex-1 bg-purple-300 text-gray-700 py-2 rounded-lg shadow
                     hover:bg-purple-400 active:bg-purple-500 cursor-pointer" onClick={updateMember}>
                수정하기
              </button>)}
              {!readOnly &&
                  (<button type={"button"} className="flex-1 bg-purple-300 text-gray-700 py-2 rounded-lg shadow
                     hover:bg-purple-400 active:bg-purple-500 cursor-pointer" onClick={updateDone}>
                    수정완료
                  </button>)}
            </div>
          </div>
        </div>
        }
      </>
  );
}
export default TestMyPage