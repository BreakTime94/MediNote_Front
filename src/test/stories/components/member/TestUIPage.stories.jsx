import TestUIPage from "./TestUIPage.jsx";
import TestRegisterPage from "./TestRegisterPage.jsx";
import TestMyPage from "./TestMyPage.jsx";
import TestMeasurement from "./TestMeasurement.jsx";


export default {
  title: "Test/member/main",
  component: TestUIPage,
  parameters: {
    reactRouterPath: "/member",
    reactExtraPath : [
        {path: "/member/signup", element: <TestRegisterPage/>},
      {path: "/member/mypage", element: <TestMyPage/>},
      {path: "/health/measurement", element: <TestMeasurement/> }
    ]
  }
};
export const Login = () =><TestUIPage/>