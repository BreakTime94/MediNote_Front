import React from "react";
import TextButton from "../button/TextButton.jsx";
import IconButton from "../button/IconButton.jsx";
import { IoIosSearch } from "react-icons/io";

function SiteHeader() {
    return (
        <header className="w-full bg-white px-6 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* 좌측 로고 영역 */}
                <div className="flex items-center">
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

                    <TextButton onClick={() => alert("로그인 버튼 클릭!")}>
                        로그인
                    </TextButton>

                    <TextButton onClick={() => alert("회원가입 버튼 클릭!")}>
                        회원가입
                    </TextButton>

                    <TextButton
                        isGradient
                        onClick={() => alert("마이페이지 버튼 클릭!")}
                    >
                        마이페이지
                    </TextButton>
                </div>
            </div>
        </header>
    );
}

export default SiteHeader;