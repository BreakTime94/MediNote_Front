
import TestMeasurement from "./components/TestMeasurement.jsx";

export default {
  title: "Test/Measurement/main",
  component: TestMeasurement,
  parameters: {
    reactRouterPath: "/health",
    reactExtraPath : [
        // {path: "/health/Measurement", element: <TestRegisterPage/>},
    ]
  }
};
export const health = () =><TestMeasurement/>