import TestUIPage from "./TestUIPage.jsx";
import TestRegisterPage from "./TestRegisterPage.jsx";
import TestMyPage from "./TestMyPage.jsx";
import TestMeasurement from "./TestMeasurement.jsx";
import QnAList from "./QnAList.jsx";
import QnARegister from "./QnARegister.jsx";
import SocialRegister from "./assets/SocialRegister.jsx";
import ChangePassword from "./ChangePassword.jsx";
import FindEmail from "./FindEmail.jsx";


export default {
  title: "Test/member/main",
  component: TestUIPage,
  parameters: {
    reactRouterPath: "/member",
    reactExtraPath : [
        {path: "/member/signup", element: <TestRegisterPage/>},
      {path: "/member/mypage", element: <TestMyPage/>},
      {path: "/health/measurement", element: <TestMeasurement/> },
      {path: "/qna", element: <QnAList/>},
      {path: "/qna/register", element: <QnARegister/>},
      {path: "/social/signup", element: <SocialRegister/>},
      {path: "/member/mypage/changepassword", element: <ChangePassword/>},
      {path:"/member/findEmail", element: <FindEmail/>},
    ]
  }
};
export const Login = () =><TestUIPage/>