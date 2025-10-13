import React from "react";
import TextButton from "../button/TextButton.jsx";
import IconButton from "../button/IconButton.jsx";
import { IoIosSearch } from "react-icons/io";
import {useNavigate} from "react-router-dom";
import {useAuthStore} from "@/components/common/hooks/useAuthStore.jsx";
import api from "@/components/common/api/axiosInterceptor.js";

function SiteHeader() {
  const navigate = useNavigate();
  const{member, setMember} = useAuthStore();
    return (
        <header className="w-full bg-white px-6 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* 좌측 로고 영역 */}
                <div className="flex items-center hover:cursor-pointer" onClick={()=>{navigate("/")}}>
                    {/* 로고 플레이스홀더 */}
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-[#ff9bd4] to-[#c89cff] rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-bold">M</span>
                        </div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-[#ff9bd4] to-[#c89cff] bg-clip-text text-transparent">
                            medinote
                        </span>
                    </div>
                </div>

                {/* 우측 버튼들 */}
                <div className="flex items-center space-x-4">
                    <IconButton
                        onClick={() => alert("검색 버튼 클릭!")}
                        ariaLabel="검색"
                    >
                        <IoIosSearch size={20} />
                    </IconButton>

                  {/* 비로그인 일 때 */}
                  {!member && (
                      <>
                        <TextButton onClick={() => navigate("/member/login")}>
                          로그인
                        </TextButton>
                        <TextButton onClick={() => navigate("/member/register")}>
                          회원가입
                        </TextButton>
                      </>
                  )}

                  {/* 로그인 완료 */}
                  {member && (
                      <>
              <span className="text-sm text-gray-700">
                {member.nickname} 님 반갑습니다!
              </span>
                        <TextButton
                            isGradient
                            onClick={() => navigate("/member/mypage")}
                        >
                          마이페이지
                        </TextButton>
                        <TextButton onClick={(e) => {
                          e.preventDefault()
                          api.post("/member/auth/logout", {} ,{
                            withCredentials: true
                          }).then(() => {
                            console.log("로그아웃 성공했습니다.");
                            setMember(null);
                            navigate("/")
                          }).catch((error) => {
                            console.log("error : ", error);
                          })
                        }}>로그아웃</TextButton>
                      </>
                  )}
                </div>
            </div>
        </header>
    );
}

export default SiteHeader;