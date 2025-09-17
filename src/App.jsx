import './App.css'
import {RouterProvider} from "react-router-dom";
import router from "./router/router.jsx";
import {Suspense} from "react";

function App() {
  return (
      <Suspense fallback={null}>
        <RouterProvider router={router} />
      </Suspense>
  )
}

export default App
