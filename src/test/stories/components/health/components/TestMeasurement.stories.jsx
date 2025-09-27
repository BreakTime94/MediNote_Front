
import TestMeasurement from "./TestMeasurement.jsx";

export default {
  title: "Test/health/measurement",
  component: TestMeasurement,
  parameters: {
    reactRouterPath: "/health",
    reactExtraPath : [
        {path: "/health/Measurement", element: <TestMeasurement/>},
    ]
  }
};
export const health = () =><TestMeasurement/>