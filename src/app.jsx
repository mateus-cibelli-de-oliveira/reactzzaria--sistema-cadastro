import { lazy, Suspense } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { LinearProgress } from "@mui/material";
import { useAuth } from "@/hooks";

import { HOME, LOGIN } from "@/routes";

const MainPage = lazy(() => import("@/pages/main"));
const Login = lazy(() => import("@/pages/login"));

function App() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LinearProgress />;

  const isLoginPage = location.pathname === LOGIN;

  // logado e tentando entrar na /login => manda para /
  if (user && isLoginPage) {
    return <Navigate to={HOME} replace />;
  }

  // não logado e tentando entrar em qualquer outra página => manda para /login
  if (!user && !isLoginPage) {
    return <Navigate to={LOGIN} replace />;
  }

  return (
    <Suspense fallback={<LinearProgress />}>
      <Routes>
        <Route path={LOGIN} element={<Login />} />
        <Route path={`${HOME}*`} element={<MainPage />} />
      </Routes>
    </Suspense>
  );
}

export default App;
