export default function Logout() {
  const logout = () => {
    localStorage.clear();
    window.location = "/";
  };

  return <button onClick={logout}>Logout</button>;
}
