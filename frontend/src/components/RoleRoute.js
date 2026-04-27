import { Navigate } from "react-router-dom";

export default function RoleRoute({ role, children }) {
  const user =
    JSON.parse(localStorage.getItem("user")) ||
    JSON.parse(sessionStorage.getItem("user"));
  const allowedRoles = Array.isArray(role) ? role : [role];

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
