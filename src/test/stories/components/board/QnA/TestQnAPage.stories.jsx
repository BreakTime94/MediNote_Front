import QnAList from "./QnAList.jsx";
import QnARegister from "./QnARegister.jsx";

export default{
    title: "Test/board/qna",
    component: QnAList,
    parameters: {
        reactRouterPath: "/qna",
        reactExtraPath : [
            {path: "/qna/register", element: <QnARegister />},
            {path: "/qna/modify", element: null},
            {path: "/qna/read", element: null}
        ]
    }
};

export const QnA = () => <QnAList />;