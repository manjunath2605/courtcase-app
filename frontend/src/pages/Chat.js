import { useEffect, useRef, useState } from "react";
import api from "../api";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
} from "@mui/material";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const bottomRef = useRef();
  const user =
    JSON.parse(localStorage.getItem("user")) ||
    JSON.parse(sessionStorage.getItem("user"));

  const fetchMessages = async () => {
    try {
      const res = await api.get("/chat");
      setMessages(res.data);
    } catch {
      setMessages([]);
    }
  };

  useEffect(() => {
    fetchMessages();
    api.post("/chat/mark-read").catch(() => {});
    const interval = setInterval(fetchMessages, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!text.trim()) return;
    try {
      await api.post("/chat", { message: text });
      setText("");
      fetchMessages();
    } catch {}
  };

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", height: "80vh" }}>
      <Typography variant="h6" mb={2}>
        Team Chat
      </Typography>

      <Paper
        sx={{
          p: 2,
          height: "65vh",
          overflowY: "auto",
          background: "#f5f5f5",
        }}
      >
        {messages.map((m) => {
          const isMe = m.senderId === user.id;

          return (
            <Box
              key={m._id}
              sx={{
                display: "flex",
                justifyContent: isMe ? "flex-end" : "flex-start",
                mb: 1,
              }}
            >
              <Box
                sx={{
                  maxWidth: "70%",
                  p: 1.5,
                  borderRadius: 2,
                  background: isMe ? "#1976d2" : "#fff",
                  color: isMe ? "#fff" : "#000",
                }}
              >
                {!isMe && (
                  <Typography variant="caption" fontWeight="bold">
                    {m.senderName}
                  </Typography>
                )}
                <Typography>{m.message}</Typography>
                <Typography
                  variant="caption"
                  sx={{ opacity: 0.7, display: "block", mt: 0.5 }}
                >
                  {new Date(m.createdAt).toLocaleTimeString()}
                </Typography>
              </Box>
            </Box>
          );
        })}
        <div ref={bottomRef} />
      </Paper>

      <Box sx={{ display: "flex", mt: 2 }}>
        <TextField
          fullWidth
          placeholder="Type a message…"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <Button variant="contained" sx={{ ml: 1 }} onClick={sendMessage}>
          Send
        </Button>
      </Box>
    </Box>
  );
}
