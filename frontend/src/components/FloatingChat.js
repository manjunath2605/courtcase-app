import { useCallback, useEffect, useRef, useState } from "react";
import api from "../api";
import {
  Box,
  IconButton,
  TextField,
  Button,
  Typography,
  Badge,
  Paper,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import dayjs from "dayjs";

export default function FloatingChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [unread, setUnread] = useState(0);

  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const bottomRef = useRef();

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  /* =====================
     RESPONSIVE
  ===================== */
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  /* =====================
     API
  ===================== */
  const fetchMessages = useCallback(async () => {
    if (!token) return;
    try {
      const res = await api.get("/chat");
      setMessages(res.data);
    } catch {
      setMessages([]);
    }
  }, [token]);

  const fetchUnread = useCallback(async () => {
    if (!token) return;
    try {
      const res = await api.get("/chat/unread-count");
      setUnread(res.data.count);
    } catch {
      setUnread(0);
    }
  }, [token]);

  /* =====================
     EFFECTS
  ===================== */
  useEffect(() => {
    if (!token) return;
    fetchUnread();
    const interval = setInterval(fetchUnread, 5000);
    return () => clearInterval(interval);
  }, [fetchUnread, token]);

  useEffect(() => {
    if (!token || !open) return;
    fetchMessages();
    api.post("/chat/mark-read").catch(() => {});
  }, [fetchMessages, open, token]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* =====================
     HELPERS
  ===================== */
  const sendMessage = async () => {
    if (!text.trim()) return;
    await api.post("/chat", { message: text });
    setText("");
    fetchMessages();
  };

  const isEditable = (createdAt) => {
    const FIVE_MIN = 5 * 60 * 1000;
    return Date.now() - new Date(createdAt).getTime() < FIVE_MIN;
  };

  const startEdit = (msg) => {
    setEditingId(msg._id);
    setEditText(msg.message);
  };

  const saveEdit = async (id) => {
    const res = await api.put(`/chat/${id}`, { message: editText });
    setMessages((prev) =>
      prev.map((m) => (m._id === id ? res.data : m))
    );
    setEditingId(null);
  };

  const deleteMsg = async (id) => {
    if (!window.confirm("Delete this message?")) return;
    await api.delete(`/chat/${id}`);
    setMessages((prev) => prev.filter((m) => m._id !== id));
  };

  if (!token) return null;

  return (
    <>
      {/* =====================
          CHAT ICON
      ===================== */}
      <Box
        sx={{
          position: "fixed",
          bottom: isMobile ? 16 : 90,
          right: isMobile ? 16 : 20,
          zIndex: 3000,
        }}
      >
        <IconButton
          onClick={() => setOpen(true)}
          sx={{
            bgcolor: "primary.main",
            color: "#fff",
            width: isMobile ? 56 : "auto",
            height: isMobile ? 56 : "auto",
            "&:hover": { bgcolor: "primary.dark" },
          }}
        >
          <Badge badgeContent={unread} color="error">
            <ChatIcon />
          </Badge>
        </IconButton>
      </Box>

      {/* =====================
          CHAT WINDOW
      ===================== */}
      {open && (
        <Paper
          elevation={8}
          sx={{
            position: "fixed",
            bottom: isMobile ? 0 : 70,
            right: isMobile ? 0 : 50,
            left: isMobile ? 0 : "auto",

            width: isMobile ? "100vw" : 340,
            height: isMobile ? "100vh" : 420,

            borderRadius: isMobile ? 0 : 2,
            display: "flex",
            flexDirection: "column",
            zIndex: 3000,
          }}
        >
          {/* HEADER */}
          <Box
            sx={{
              p: 1.5,
              bgcolor: "primary.main",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography fontWeight="bold">Team Chat</Typography>
            <IconButton onClick={() => setOpen(false)}>
              <CloseIcon sx={{ color: "#fff" }} />
            </IconButton>
          </Box>

          {/* MESSAGES */}
          <Box
            sx={{
              flex: 1,
              p: 1,
              overflowY: "auto",
              bgcolor: "#f5f5f5",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {messages.map((m) => {
              const myId = user?._id || user?.id;
              const isMe = m.senderId?.toString() === myId;
              const canEdit = isMe && isEditable(m.createdAt);
              const isSeen = m.readBy?.length > 1;

              return (
                <Box
                  key={m._id}
                  className="message-row"
                  sx={{
                    display: "flex",
                    justifyContent: isMe ? "flex-end" : "flex-start",
                    mb: 1,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 0.5,
                      maxWidth: "80%",
                    }}
                  >
                    {/* MESSAGE BUBBLE */}
                    <Box
                      sx={{
                        bgcolor: isMe ? "primary.main" : "#fff",
                        color: isMe ? "#fff" : "#000",
                        p: 1,
                        borderRadius: 2,
                        maxWidth: "100%",
                      }}
                    >
                      {!isMe && (
                        <Typography variant="caption" fontWeight="bold">
                          {m.senderName}
                        </Typography>
                      )}

                      {editingId === m._id ? (
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <TextField
                            size="small"
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                          />
                          <IconButton
                            size="small"
                            onClick={() => saveEdit(m._id)}
                          >
                            <CheckIcon />
                          </IconButton>
                        </Box>
                      ) : (
                        <Typography variant="body2">
                          {m.message}
                        </Typography>
                      )}

                      <Typography
                        variant="caption"
                        sx={{
                          display: "block",
                          textAlign: "right",
                          opacity: 0.7,
                        }}
                      >
                        {dayjs(m.createdAt).format("HH:mm")}
                        {m.edited && " • edited"}
                        {isMe && isSeen && " • Seen"}
                      </Typography>
                    </Box>

                    {/* EDIT / DELETE */}
                    {canEdit && editingId !== m._id && (
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 0.5,
                          opacity: 0,
                          transition: "opacity 0.2s",
                          ".message-row:hover &": {
                            opacity: 1,
                          },
                        }}
                      >
                        <IconButton
                          size="small"
                          sx={{ color: "#2e7d32" }}
                          onClick={() => startEdit(m)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>

                        <IconButton
                          size="small"
                          sx={{ color: "#d32f2f" }}
                          onClick={() => deleteMsg(m._id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    )}
                  </Box>
                </Box>
              );
            })}
            <div ref={bottomRef} />
          </Box>

          {/* INPUT */}
          <Box
            sx={{
              display: "flex",
              gap: 1,
              p: 1,
              borderTop: "1px solid #ddd",
            }}
          >
            <TextField
              size="small"
              fullWidth
              placeholder="Message…"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <Button variant="contained" onClick={sendMessage}>
              Send
            </Button>
          </Box>
        </Paper>
      )}
    </>
  );
}
