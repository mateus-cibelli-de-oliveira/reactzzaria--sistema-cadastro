import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { LinearProgress } from "@mui/material";
import { ProtectedRoute } from "@/components/protected-route";

import { HOME, LOGIN } from "@/routes";

const MainPage = lazy(() => import("@/pages/main"));
const Login = lazy(() => import("@/pages/login"));

function App() {
  return (
    <Suspense fallback={<LinearProgress />}>
      <Routes>
        <Route path={LOGIN} element={<Login />} />
        <Route
          path={`${HOME}*`}
          element={
            <ProtectedRoute>
              <MainPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Suspense>
  );
}

export default App;
