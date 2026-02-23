import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const user =
    JSON.parse(localStorage.getItem("user")) ||
    JSON.parse(sessionStorage.getItem("user"));

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
}
