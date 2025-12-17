import FloatingChat from "../components/FloatingChat";

export default function ProtectedLayout({ children }) {
  return (
    <>
      {children}
      <FloatingChat />
    </>
  );
}
