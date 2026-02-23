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
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import dayjs from "dayjs";

const QUICK_EMOJIS = ["🙂", "👍", "🙏", "✅", "📌", "⚖️", "📅", "📄", "🎯", "💬"];

export default function FloatingChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [unread, setUnread] = useState(0);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const bottomRef = useRef(null);
  const audioCtxRef = useRef(null);
  const unreadInitializedRef = useRef(false);
  const prevUnreadRef = useRef(0);

  const user =
    JSON.parse(localStorage.getItem("user")) ||
    JSON.parse(sessionStorage.getItem("user"));
  const isLoggedIn = Boolean(user);
  const isClient = user?.role === "client";
  const myId = String(user?._id || user?.id || "");
  const chatFont = '"Segoe UI", "Helvetica Neue", Arial, sans-serif';

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const ensureAudioContext = useCallback(() => {
    if (typeof window === "undefined") return null;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;

    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContextClass();
    }

    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume().catch(() => {});
    }

    return audioCtxRef.current;
  }, []);

  const playIncomingSound = useCallback(() => {
    const ctx = ensureAudioContext();
    if (!ctx) return;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(880, ctx.currentTime);
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    gainNode.gain.setValueAtTime(0.0001, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.13, ctx.currentTime + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.18);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.2);
  }, [ensureAudioContext]);

  const fetchMessages = useCallback(async () => {
    if (!isLoggedIn) return;
    try {
      const res = await api.get("/chat");
      setMessages(res.data);
    } catch {
      setMessages([]);
    }
  }, [isLoggedIn]);

  const fetchUnread = useCallback(async () => {
    if (!isLoggedIn) return;
    try {
      const res = await api.get("/chat/unread-count");
      const count = Number(res.data.count || 0);
      setUnread(count);

      if (unreadInitializedRef.current && count > prevUnreadRef.current) {
        playIncomingSound();
      }
      prevUnreadRef.current = count;
      unreadInitializedRef.current = true;
    } catch {
      setUnread(0);
    }
  }, [isLoggedIn, playIncomingSound]);

  useEffect(() => {
    if (!isLoggedIn) return;
    fetchUnread();
    const interval = setInterval(fetchUnread, 5000);
    return () => clearInterval(interval);
  }, [fetchUnread, isLoggedIn]);

  useEffect(() => {
    if (!isLoggedIn || !open) return;
    fetchMessages();
    api.post("/chat/mark-read").catch(() => {});
  }, [fetchMessages, isLoggedIn, open]);

  useEffect(() => {
    if (!isLoggedIn || !open) return;
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [fetchMessages, isLoggedIn, open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessageText = useCallback(
    async (value) => {
      const message = (value ?? text).trim();
      if (!message) return;
      await api.post("/chat", { message });
      if (value == null) setText("");
      setShowEmojiPicker(false);
      await fetchMessages();
      await fetchUnread();
    },
    [fetchMessages, fetchUnread, text]
  );

  const insertEmoji = (emoji) => {
    setText((prev) => `${prev}${emoji}`);
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
    setMessages((prev) => prev.map((m) => (m._id === id ? res.data : m)));
    setEditingId(null);
  };

  const deleteMsg = async (id) => {
    if (!window.confirm("Delete this message?")) return;
    await api.delete(`/chat/${id}`);
    setMessages((prev) => prev.filter((m) => m._id !== id));
  };

  if (!isLoggedIn || isClient) return null;

  return (
    <>
      <Box
        sx={{
          position: "fixed",
          bottom: isMobile ? 14 : 90,
          right: isMobile ? 14 : 20,
          zIndex: 3000,
        }}
      >
        <IconButton
          onClick={() => {
            ensureAudioContext();
            setOpen(true);
          }}
          sx={{
            background: "linear-gradient(135deg, #0f4f78 0%, #1d7a73 100%)",
            color: "#fff",
            width: isMobile ? 58 : 54,
            height: isMobile ? 58 : 54,
            borderRadius: 999,
            boxShadow: "0 12px 28px rgba(15,79,120,0.36)",
            "&:hover": { filter: "brightness(1.06)" },
          }}
        >
          <Badge badgeContent={unread} color="error">
            <ChatIcon sx={{ fontSize: isMobile ? 26 : 24 }} />
          </Badge>
        </IconButton>
      </Box>

      {open && (
        <Paper
          elevation={8}
          sx={{
            position: "fixed",
            bottom: isMobile ? 0 : 74,
            right: isMobile ? 0 : 24,
            left: isMobile ? 0 : "auto",
            width: isMobile ? "100vw" : 380,
            height: isMobile ? "100dvh" : 520,
            borderRadius: isMobile ? 0 : 4,
            display: "flex",
            flexDirection: "column",
            zIndex: 3000,
            overflow: "hidden",
            border: "1px solid rgba(14,43,67,0.14)",
            fontFamily: chatFont,
          }}
        >
          <Box
            sx={{
              px: 2,
              py: 1.5,
              background: "linear-gradient(135deg, #0f4f78 0%, #1d7a73 100%)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: "0.98rem", letterSpacing: 0.2 }}>
                Team Chat
              </Typography>
              <Typography sx={{ opacity: 0.88, fontSize: "0.73rem" }}>
                Internal updates and quick replies
              </Typography>
            </Box>
            <IconButton onClick={() => setOpen(false)} size="small">
              <CloseIcon sx={{ color: "#fff" }} />
            </IconButton>
          </Box>

          <Box
            sx={{
              flex: 1,
              px: 1.25,
              py: 1.5,
              overflowY: "auto",
              background:
                "radial-gradient(circle at 10% 10%, #f4f9ff 0%, #eef5fc 45%, #edf4fb 100%)",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {messages.map((m) => {
              const isMe = String(m.senderId || "") === myId;
              const canEdit = isMe && isEditable(m.createdAt);
              const isSeen = m.readBy?.length > 1;

              return (
                <Box
                  key={m._id}
                  className="message-row"
                  sx={{
                    display: "flex",
                    justifyContent: isMe ? "flex-end" : "flex-start",
                    mb: 1.1,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 0.65,
                      maxWidth: isMobile ? "92%" : "84%",
                    }}
                  >
                    <Box
                      sx={{
                        bgcolor: isMe ? "#0f5b87" : "rgba(255,255,255,0.94)",
                        color: isMe ? "#fff" : "#102235",
                        px: 1.3,
                        py: 0.95,
                        borderRadius: isMe ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                        maxWidth: "100%",
                        border: isMe ? "none" : "1px solid rgba(16,34,53,0.08)",
                        boxShadow: "0 3px 10px rgba(11,36,59,0.08)",
                      }}
                    >
                      {!isMe && (
                        <Typography
                          variant="caption"
                          sx={{ fontWeight: 700, fontSize: "0.68rem", color: "#355272" }}
                        >
                          {m.senderName}
                        </Typography>
                      )}

                      {editingId === m._id ? (
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <TextField
                            size="small"
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            sx={{
                              "& .MuiInputBase-root": {
                                fontSize: "0.88rem",
                                bgcolor: "#fff",
                              },
                            }}
                          />
                          <IconButton size="small" onClick={() => saveEdit(m._id)}>
                            <CheckIcon />
                          </IconButton>
                        </Box>
                      ) : (
                        <Typography sx={{ fontSize: "0.89rem", lineHeight: 1.45 }}>
                          {m.message}
                        </Typography>
                      )}

                      <Typography
                        variant="caption"
                        sx={{
                          display: "block",
                          textAlign: "right",
                          opacity: 0.78,
                          fontSize: "0.68rem",
                          mt: 0.6,
                        }}
                      >
                        {dayjs(m.createdAt).format("HH:mm")}
                        {m.edited && " | edited"}
                        {isMe && isSeen && " | seen"}
                      </Typography>
                    </Box>

                    {canEdit && editingId !== m._id && (
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 0.5,
                          opacity: isMobile ? 1 : 0,
                          transition: "opacity 0.2s ease",
                          ".message-row:hover &": {
                            opacity: 1,
                          },
                        }}
                      >
                        <IconButton
                          size="small"
                          sx={{
                            color: "#2e7d32",
                            bgcolor: "rgba(255,255,255,0.9)",
                            border: "1px solid rgba(46,125,50,0.25)",
                          }}
                          onClick={() => startEdit(m)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>

                        <IconButton
                          size="small"
                          sx={{
                            color: "#d32f2f",
                            bgcolor: "rgba(255,255,255,0.9)",
                            border: "1px solid rgba(211,47,47,0.25)",
                          }}
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

          <Box
            sx={{
              display: "flex",
              gap: 0.7,
              flexWrap: "wrap",
              px: 1.1,
              pt: 1,
              pb: "calc(env(safe-area-inset-bottom, 0px) + 10px)",
              borderTop: "1px solid rgba(16,34,53,0.1)",
              backgroundColor: "#fff",
            }}
          >
            {showEmojiPicker && (
              <Box
                sx={{
                  width: "100%",
                  p: 0.75,
                  borderRadius: 2,
                  border: "1px solid rgba(16,34,53,0.12)",
                  bgcolor: "#f9fcff",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 0.5,
                }}
              >
                {QUICK_EMOJIS.map((emoji) => (
                  <Button
                    key={emoji}
                    onClick={() => insertEmoji(emoji)}
                    sx={{
                      minWidth: 34,
                      width: 34,
                      height: 34,
                      p: 0,
                      borderRadius: 1.5,
                      fontSize: "1.1rem",
                    }}
                  >
                    {emoji}
                  </Button>
                ))}
              </Box>
            )}

            <IconButton
              onClick={() => setShowEmojiPicker((prev) => !prev)}
              sx={{
                border: "1px solid rgba(16,34,53,0.16)",
                borderRadius: 999,
              }}
              aria-label="Toggle emojis"
            >
              <EmojiEmotionsIcon />
            </IconButton>

            <TextField
              size="small"
              fullWidth
              placeholder="Type a message..."
              value={text}
              onFocus={ensureAudioContext}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessageText()}
              sx={{
                "& .MuiInputBase-root": {
                  borderRadius: 999,
                  fontSize: "0.92rem",
                  fontFamily: chatFont,
                },
              }}
            />

            <Button
              variant="contained"
              onClick={() => sendMessageText()}
              sx={{
                borderRadius: 999,
                px: 2.2,
                textTransform: "none",
                fontWeight: 700,
                minWidth: isMobile ? 78 : 88,
                background: "linear-gradient(135deg, #0f4f78 0%, #1d7a73 100%)",
              }}
            >
              Send
            </Button>
          </Box>
        </Paper>
      )}
    </>
  );
}
