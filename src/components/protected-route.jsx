import { Navigate } from "react-router-dom";
import { LinearProgress } from "@mui/material";
import { useAuth } from "@/hooks";

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <LinearProgress />;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
