import {lazy} from "react";

const Measurement = lazy(() => import("@/pages/health/Measurement.jsx"));
const MeasurementEdit = lazy(() => import("@/pages/health/MeasurementEdit.jsx"));

const measurementRouter = [
  {
    path: "/health/measurement", element: <Measurement />
  },
  {
    path: "/health/measurement/:id/edit", element: <MeasurementEdit />
  },
];

export default measurementRouter;
