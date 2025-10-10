import { lazy } from "react";

const Login = lazy(() => import("@/pages/member/Login.jsx"));
const FindPassword = lazy(() => import("@/pages/member/FindPassword.jsx"));
const MyPage = lazy(() => import("@/pages/member/MyPage.jsx"));
const SocialRegister = lazy(() => import("@/pages/member/SocialRegister.jsx"))
const RegisterPage = lazy(() => import("@/pages/member/RegisterPage.jsx"))
const FindEmail = lazy(() => import("@/pages/member/FindEmail.jsx"))
const ChangePassword = lazy(() => import("@/pages/member/ChangePassword.jsx"))

const memberRouter = [
  {
    path: "/member/login",
    element: <Login />,
  },
  {
    path: "/member/social/register",
    element: <SocialRegister/>,
  },
  {
    path: "/member/register",
    element:<RegisterPage/>
  },
  {
    path: "/member/change/password",
    element: <ChangePassword/>
  },
  {
    path: "/member/find/email",
    element: <FindEmail/>
  },
  {
    path: "/member/find/password",
    element: <FindPassword />,
  },
  {
    path: "/member/mypage",
    element: <MyPage />,
  },
];

export default memberRouter;