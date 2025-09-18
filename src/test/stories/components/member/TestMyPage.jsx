import React, {useEffect, useState} from "react";
import axios from "axios";

function TestMyPage() {
  const {memberDto, setMemberDto} = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8083/api/member/auth/login")
        .then((res) => {
          console.log("Content-Type", res.headers["content-type"])
          setMemberDto(res.data)
          console.log(memberDto)
        })
        .catch((error) => {
          console.log("error : ", error)
        })
  }, []);



  return(
      <>
        {memberDto &&
        <div className={"flex items-center justify-center min-h-screen"}>
          <div className={"gap-2 w-96 border-1"}>
            <div className={"m-2"}>
              <label>아이디</label>
              <input className={"border w-full"} name={"email"} id={"name"} value={memberDto.email} />
            </div>
            <div className={"m-2"}>
              <label>닉네임</label>
              <input className={"border w-full"} value={memberDto.nickname}/>
            </div>
            <div className={"m-2"}>
              <label>추가이메일</label>
              <input className={"border w-full"} value={memberDto.extraEmail}/>
            </div>
            <div className={"m-2"}>
              <label>프로필이미지</label>
              <input className={"border w-full"} value={memberDto.profileImagePath || "이미지가 없습니다."}/>
            </div>
            <div className={"m-2"}>
              <label>계정등록일</label>
              <input className={"border w-full"} value={memberDto.regDate}/>
            </div>
          </div>
        </div>
        }
      </>
  );
}
export default TestMyPage