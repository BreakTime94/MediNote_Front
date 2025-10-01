import React, {useEffect, useState} from "react";
import axios from "axios";
import LogoutButton from "./LogoutButton.jsx";
import {useNavigate} from "react-router-dom";

function TestMyPage() {
  const [memberDto, setMemberDto] = useState({
    email: "",
    nickname: "",
    extraEmail: "",
    profileImagePath: "",
    regDate: ""
  });

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

  const writeMeasurement = (e) => {
    e.preventDefault();
    navigate("/health/measurement");
  }

  const boardList = (e) => {
    e.preventDefault();
    navigate("/qna")
  }

  const boardRegister = (e) => {
    e.preventDefault();
    navigate("/qna/register")
  }


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
              <input className={"border w-full"} value={memberDto.nickname} readOnly={true}/>
            </div>
            <div className={"m-2"}>
              <label className="block text-sm font-medium text-gray-700 mb-1">추가이메일</label>
              <input className={"border w-full"} value={memberDto.extraEmail} readOnly={true}/>
            </div>
            <div className={"m-2"}>
              <label className="block text-sm font-medium text-gray-700 mb-1">프로필이미지</label>
              <input className={"border w-full"} value={memberDto.profileImagePath || "이미지가 없습니다."} readOnly={true}/>
            </div>
            <div className={"m-2"}>
              <label className="block text-sm font-medium text-gray-700 mb-1">계정등록일</label>
              <input className={"border w-full"} value={memberDto.regDate} readOnly={true}/>
            </div>
            <div  className={"m-2"}>
              <LogoutButton children = {"로그아웃"} onClick={logout} />
            </div>
            <div  className={"m-2"}>
              <button type="button"
                      className="flex-1 bg-purple-300 text-gray-700 py-2 rounded-lg shadow
                     hover:bg-purple-400 active:bg-purple-500 cursor-pointer"
              onClick={writeMeasurement}>
                개인 건강기록 입력
              </button>
              <button type="button"
                      className="flex-1 bg-purple-300 text-gray-700 py-2 rounded-lg shadow
                     hover:bg-purple-400 active:bg-purple-500 cursor-pointer"
                      onClick={boardList}>
                BoardList
              </button>
              <button type="button"
                      className="flex-1 bg-purple-300 text-gray-700 py-2 rounded-lg shadow
                     hover:bg-purple-400 active:bg-purple-500 cursor-pointer"
                      onClick={boardRegister}>
                BoardList
              </button>
            </div>
          </div>
        </div>
        }
      </>
  );
}
export default TestMyPage