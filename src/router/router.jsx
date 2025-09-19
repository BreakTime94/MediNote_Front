import React, {lazy} from "react";
import { createBrowserRouter} from "react-router-dom";
import RootLayout from '../layouts/RootLayout.jsx'

//Lazy 로드
const Index = lazy(() => import("../pages/home/Index.jsx"))

const router = createBrowserRouter([
    {
        path:"/",
        element:<RootLayout/>,
        children:[
            //이곳에는 페이지 연결
            //인텍스 페이지
            {index: true, element: <Index />},

            // 보호 구간: 가드로 감싸서 하위 라우트 보호, 인증 필요한 페이지
            {

            }
        ]
    }
]);

export default router;