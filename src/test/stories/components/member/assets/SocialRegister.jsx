import React, {useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import api from "../axiosInterceptor.js";

export default function SocialRegister() {
  const location = useLocation();
  const socialData = location.state.dto; // SuccessHandler에서 받은 dto
  const [info, setInfo] = useState({ ...socialData, extraEmail: "" });
  const navigate = useNavigate();

  const emailValue = (e) => {
    const {name, value} = e.target
    e.preventDefault();
    setInfo({...info, [name]: value})
  }

  const submit = (e) => {
    if(!window.confirm("정말 제출하시겠습니까?")) return;
    e.preventDefault();
    api.post("/social/auth/register", info, {
      withCredentials : true
    }).then((resp) => {
      console.log("Content-type :", resp.headers[`content-type`])
      navigate(`/member/mypage`);
    }
    ).catch((error) => {
      console.log("Error : ", error)
        }
    )

  }

  return (
      <div>
        <p>가입하시는 이메일: {info.email}</p>

        {/* 추가 입력 폼 */}
        <div>
          <input type="text" name={"extraEmail"} placeholder="추가이메일" className="border p-2" onChange={emailValue} />
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded" onClick={submit}>
            가입 완료
          </button>
        </div>
      </div>
  );
}
