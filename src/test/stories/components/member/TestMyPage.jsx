import React, {useEffect, useState} from "react";
import axios from "axios";
import LogoutButton from "./LogoutButton.jsx";
import {useNavigate} from "react-router-dom";
import api from "./axiosInterceptor.js";
import ExtraEmailVerification from "./ExtraEmailVerification.jsx";
import UseDuplicateCheck from "./UseDuplicateCheck.jsx";

function TestMyPage() {
  const [memberDto, setMemberDto] = useState({
    email: "",
    nickname: "",
    extraEmail: "",
    profileImagePath: "",
    regDate: ""
  });
  //인증여부
  const [verification, setVerification] = useState(false);

  //읽기전용인지 아닌지(Mypage Component에서 수정도 같이 진행)
  const[readOnly, setReadOnly] = useState(true);
  //최초 focus 여부
  const[touched, setTouched] = useState({
    extraEmail: false,
    nickname: false,
  })
  //유효성 검사 실패내용 담음
  const [errors, setErrors] = useState({});

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validation(name, value) }));
  };

  const validation = (name, value) => {
    switch (name) {
      case "extraEmail":
        if (!value) return "추가 이메일은 필수입니다.";
        if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(value)) {
          return "올바른 이메일 형식이어야 합니다. ex) aaa@bbb.ccc 등";
        }
        break;

      case "nickname":
        if (!value) return "닉네임은 필수입니다.";
        if (!/^[가-힣a-zA-Z0-9]{2,16}$/.test(value)) {
          return "닉네임은 한글, 영문, 숫자만 사용하여 2~16자까지 가능합니다.";
        }
        break;
      default:
        return "";
    }
    return "";
  }

  const extraEmailStatus = UseDuplicateCheck("email", memberDto.extraEmail, "/member/check/email", validation);
  const nicknameStatus = UseDuplicateCheck("nickname", memberDto.nickname, "/member/check/nickname", validation);

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

  const change = (e) => {
    const {name, value} = e.target;
    e.preventDefault();
    setMemberDto((prev) => ({...prev, [name]: value}))
  }

  const updateMember = (e) => {
    e.preventDefault();
    setReadOnly(false);
  }

  const updateDone = (e) => {
    e.preventDefault();
    setReadOnly(true);
  }

  return(
      <>
        {memberDto &&
        <div className={"flex items-center justify-center min-h-screen"}>
          <div className={"gap-2 w-96 border-1"}>
            <div className={"m-2"}>
              <label className="block text-sm font-medium text-gray-700 mb-1">아이디</label>
              <input className={"border w-full"} name={"email"} id={"name"} value={memberDto.email} readOnly={true}/>
            </div>
            <div className={"m-2"}>
              <label className="block text-sm font-medium text-gray-700 mb-1">닉네임</label>
              <input className={"border w-full"} name={"nickname"} value={memberDto.nickname} readOnly={readOnly} onChange={change}/>
            </div>
            <ExtraEmailVerification member={memberDto} touched={touched} errors={errors} emailStatus={extraEmailStatus} handleBlur={handleBlur}
            change={change} verification={verification}/>
            <div className={"m-2"}>
              <label className="block text-sm font-medium text-gray-700 mb-1">프로필이미지</label>
              <input className={"border w-full"} name={"profileImagePath"} value={memberDto.profileImagePath || "이미지가 없습니다."} readOnly={true}/>
            </div>
            <div className={"m-2"}>
              <label className="block text-sm font-medium text-gray-700 mb-1">계정등록일</label>
              <input className={"border w-full"} name={"regDate"} value={memberDto.regDate} readOnly={true}/>
            </div>
            {readOnly && (<div className={"m-2"}>
              <LogoutButton children = {"로그아웃"} onClick={logout} />
            </div>)}
            <div  className={"m-2 text-sm"}>
              {readOnly &&
                (<button type={"button"} className="flex-1 bg-purple-300 text-gray-700 px-2 py-1 rounded-lg shadow
                     hover:bg-purple-400 active:bg-purple-500 cursor-pointer" onClick={updateMember}>
                수정하기
              </button>)}
              {!readOnly &&
                  (<button type={"button"} className="flex-1 bg-purple-300 text-gray-700 px-2 py-1 rounded-lg shadow
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