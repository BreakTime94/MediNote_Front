import './App.css'
import {RouterProvider} from "react-router-dom";
import router from "./router/router.jsx";
import {Suspense, useEffect} from "react";
import {useAuthStore} from "@/components/common/hooks/useAuthStore.jsx";

function App() {
  const { fetchMember, loading } = useAuthStore();

  useEffect(() => {
    fetchMember(); // 앱 시작 시 로그인 사용자 확인
  }, []);

  if (loading) return <div className="p-8 text-center">로딩 중...</div>;
  return (
      <Suspense fallback={null}>
        <RouterProvider router={router} />
      </Suspense>
  )
}

export default App
