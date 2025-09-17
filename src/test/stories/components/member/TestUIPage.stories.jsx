import TestUIPage from "./TestUIPage.jsx";
import TestUIPageStories from "./TestUIPage.stories.jsx";
import TestRegisterPage from "./TestRegisterPage.jsx";

export default {
  title: "Test/member/main",
  component: TestUIPage,
  parameters: {
    reactRouterPath: "/member",
    reactExtraPath : [
        {path: "/member/signup", element: <TestRegisterPage/>}
    ]
  }
};
export const Default = () =><TestUIPage/>