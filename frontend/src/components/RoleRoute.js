import { Navigate } from "react-router-dom";

export default function RoleRoute({ role, children }) {
  const user =
    JSON.parse(localStorage.getItem("user")) ||
    JSON.parse(sessionStorage.getItem("user"));

  if (!user || user.role !== role) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
