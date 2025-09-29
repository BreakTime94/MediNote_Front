import React, {useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

function TestRegisterPage(props) {
  const [member, setMember] = useState({
    email : "",
    password : "",
    extraEmail: "",
    nickname: ""
  })

  const [errors, setErrors] = useState({});

  const[password, setPassword] = useState({
    "value": "",
    "passwordCheck": "",
    "valueChecked" : false,
  })

  const[passwordRule, setPasswordRule] = useState({
    "length" : false,
    "" : false,
    "letter" : false,
    "special" : false,
  })

  const navigate = useNavigate();

  const validation = (name, value) => {
    if(!value && ["email", "password", "nickname", "extraEmail"].includes(name)){

    }
  }

  const submit = (e) => {
    e.preventDefault()

    axios.post(`/api/member/register`, member)
        .then((res) => {
          console.log("Content-Type", res.headers[`content-type`])
          navigate("/member")
        })
        .catch((error) => {
          console.log("error", error);
        });
  }
  const change = (event) => {
    event.preventDefault()
    const{name, value} = event.target;

    setMember((prev) => ({
      ...prev, [name] : value
    }))
  }

  const passwordChange = (e) => {
    e.preventDefault();
    const value = e.target.value;

    setPassword({...password, [name] : value});
  }

  return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white shadow-lg rounded-2xl p-8 w-96">
          {/* 이메일 입력 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              이메일
            </label>
            <input
                id="email"
                name="email"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="이메일을 입력하세요"
                onChange={change}
            />
          </div>

          {/* 비밀번호 입력 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              비밀번호
            </label>
            <input
                id="password"
                name="password"
                type="password"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="비밀번호를 입력하세요"
                onChange={passwordChange}
            />
            <ul className={"mt-2 text-sm"}>
              <li className={password.length ? "text-blue-500" : "text-red-500"}>
                비밀번호는 8자 ~ 16자 사이여야 합니다.
              </li>
              <li className={password.letter ? "text-blue-500" : "text-red-500"}>
                비밀번호는 영문자를 1개이상 포함하여야 합니다.
              </li>
              <li className={password.special ? "text-blue-500" : "text-red-500"}>
                비밀번호는 특수문자를 1개이상 포함하여야 합니다.
              </li>
            </ul>
          </div>
          {/* 비밀번호 확인 */}
          <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            비밀번호
          </label>
          <input
              id="passwordCheck"
              name="passwordCheck"
              type="password"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="위에 입력하신 비밀번호를 입력하여주세요."
              onChange={change}
          />
        </div>
          {/* 추가 이메일 입력 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              추가이메일
            </label>
            <input
                id="extraEmail"
                name="extraEmail"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="아이디를 입력하세요"
                onChange={change}
            />
          </div>
          {/* 닉네임 입력 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              닉네임
            </label>
            <input
                id="nickname"
                name="nickname"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="닉네임을 입력하세요"
                onChange={change}
            />
          </div>

          {/* 버튼 영역 */}
          <div className="flex gap-2">
            <button
                type="submit"
                className="flex-1 bg-pink-300 text-white py-2 rounded-lg
                     hover:bg-pink-400 active:bg-pink-500 cursor-pointer"
                onClick={submit}
            >
              제출하기
            </button>
          </div>
        </div>
      </div>
  );
}
export default TestRegisterPage