import React, {useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

function TestRegisterPage(props) {
  const [member, setMember] = useState([])

  const naviagate = useNavigate();

  const submit = (e) => {
    e.preventDefault()
    const input =  {
      email : `${e.target.email.value}`,
      password : `${e.target.password.value}`,
      extraEmail : `${e.target.extraEmail.value}`,
      nickname : `${e.target.nickname.value}`
    };

    axios.post(`http://localhost:8081/member/register`, input)
        .then((res) => {
          console.log("Content-Type", res.headers[`content-type`])
        })
        .catch((error) => {
          console.log("error", error);
        });
    naviagate("/member")
  }
  const change = (event) => {
    event.preventDefault()
    const{name, value} = event.target;

    setMember((prev) => ({
      ...prev, [name] : value
    }))
  }

  return (
      <form onSubmit={submit} className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white shadow-lg rounded-2xl p-8 w-96">
          {/* 이메일 입력 */}
          <div className="mb-4">
            <label htmlFor="id" className="block text-sm font-medium text-gray-700 mb-1">
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
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              비밀번호
            </label>
            <input
                id="password"
                name="password"
                type="password"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="비밀번호를 입력하세요"
                onChange={change}
            />
          </div>
          {/* 추가 이메일 입력 */}
          <div className="mb-4">
            <label htmlFor="extraEmail" className="block text-sm font-medium text-gray-700 mb-1">
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
            <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 mb-1">
              닉네임
            </label>
            <input
                id="nickname"
                name="nickname"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="아이디를 입력하세요"
                onChange={change}
            />
          </div>


          {/* 버튼 영역 */}
          <div className="flex gap-2">
            <button
                type="submit"
                className="flex-1 bg-pink-300 text-white py-2 rounded-lg
                     hover:bg-pink-400 active:bg-pink-500 cursor-pointer"

            >
              제출하기
            </button>
          </div>
        </div>
      </form>
  );
}
export default TestRegisterPage