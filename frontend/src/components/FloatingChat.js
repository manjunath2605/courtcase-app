import { useEffect, useRef, useState } from "react";
import api from "../api";
import {
  Box,
  IconButton,
  TextField,
  Button,
  Typography,
  Badge,
  Paper,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";

export default function FloatingChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [unread, setUnread] = useState(0);

  const bottomRef = useRef();

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  /* =====================
     API CALLS
  ===================== */
  const fetchMessages = async () => {
    if (!token) return;
    const res = await api.get("/chat");
    setMessages(res.data);
  };

  const fetchUnread = async () => {
    if (!token) return;
    const res = await api.get("/chat/unread-count");
    setUnread(res.data.count);
  };

  /* =====================
     EFFECTS (ALWAYS RUN)
  ===================== */
  useEffect(() => {
    if (!token) return;

    fetchUnread();
    const interval = setInterval(fetchUnread, 5000);
    return () => clearInterval(interval);
  }, [token]);

  useEffect(() => {
    if (!token || !open) return;

    fetchMessages();
    api.post("/chat/mark-read");
  }, [open, token]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* =====================
     SEND MESSAGE
  ===================== */
  const sendMessage = async () => {
    if (!text.trim() || !token) return;

    await api.post("/chat", { message: text });
    setText("");
    fetchMessages();
  };

  /* =====================
     RENDER GUARD
  ===================== */
  if (!token) return null;

  return (
    <>
      {/* 🔵 CHAT ICON (ALWAYS VISIBLE) */}
      <Box
        sx={{
          position: "fixed",
          bottom: 90,
          right: 20,
          zIndex: 3000,
        }}
      >
        <IconButton
          color="primary"
          size="large"
          onClick={() => setOpen(true)}
        >
          <Badge badgeContent={unread} color="error">
            <ChatIcon fontSize="large" />
          </Badge>
        </IconButton>
      </Box>

      {/* 🪟 CHAT WINDOW */}
      {open && (
        <Paper
          elevation={8}
          sx={{
            position: "fixed",
            bottom: 70,
            right: 50,
            width: 340,
           
            display: "flex",
            flexDirection: "column",
            zIndex: 3000,
          }}
        >
          {/* Header */}
          <Box
            sx={{
              p: 1,
              bgcolor: "primary.main",
              color: "#fff",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="subtitle1">Team Chat</Typography>
            <IconButton size="small" onClick={() => setOpen(false)}>
              <CloseIcon sx={{ color: "#fff" }} />
            </IconButton>
          </Box>

          {/* Messages */}
          <Box sx={{ flex: 1, p: 1, overflowY: "auto", bgcolor: "#f5f5f5" }}>
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
                      bgcolor: isMe ? "primary.main" : "#fff",
                      color: isMe ? "#fff" : "#000",
                      p: 1,
                      borderRadius: 2,
                      maxWidth: "75%",
                    }}
                  >
                    {!isMe && (
                      <Typography variant="caption" fontWeight="bold">
                        {m.senderName}
                      </Typography>
                    )}
                    <Typography variant="body2">{m.message}</Typography>
                  </Box>
                </Box>
              );
            })}
            <div ref={bottomRef} />
          </Box>

          {/* Input */}
          <Box sx={{ display: "flex", p: 1 }}>
            <TextField
              size="small"
              fullWidth
              placeholder="Message…"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <Button onClick={sendMessage}>Send</Button>
          </Box>
        </Paper>
      )}
    </>
  );
}
