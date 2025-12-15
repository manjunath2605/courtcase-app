import { useEffect, useState } from "react";
import api from "../api";
import { Badge } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function ChatNotification() {
  const [count, setCount] = useState(0);
  const navigate = useNavigate();

  const fetchUnread = async () => {
    try {
      const res = await api.get("/chat/unread-count");
      setCount(res.data.count);
    } catch {}
  };

  useEffect(() => {
    fetchUnread();
    const interval = setInterval(fetchUnread, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Badge
      color="error"
      badgeContent={count}
      invisible={count === 0}
      sx={{ cursor: "pointer", mx: 1 }}
      onClick={() => navigate("/chat")}
    >
      💬
    </Badge>
  );
}
