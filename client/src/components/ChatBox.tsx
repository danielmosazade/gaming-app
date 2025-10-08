import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Box, Paper, TextField, Button, Typography } from "@mui/material";

// חיבור לסוקט
const socket: Socket = io(import.meta.env.VITE_SERVER_URL,{
  transports: ["websocket"],
} );

interface Message {
  id: string;
  text: string;
  senderId?: string; 
  time?: string;
}

const ChatBox = () => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // גלילה אוטומטית לתחתית
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("✅ Connected to server:", socket.id);
    });

    socket.on("connect_error", (error) => {
      console.error("❌ Socket connection error:", error);
    });

    socket.on("receive_message", (msg: Message) => {
      if (msg && typeof msg.text === "string") {
        setChat((prev) => [...prev, msg]);
      }
    });

    return () => {
      socket.off("connect");
      socket.off("connect_error");
      socket.off("receive_message");
    };
  }, []);

  const sendMessage = () => {
    console.log(socket.id);

    if (message.trim() === "") return;

    const msg: Message = {
      id: Math.random().toString(36).slice(2, 10),
      text: message,
      senderId: socket.id,
      time: new Date().toLocaleTimeString(),
    };

    socket.emit("send_message", msg);
    setMessage("");
  };

  return (
    <Box display="flex" flexDirection="column" gap={2} height="100%">
      {/* תיבת הצ'אט */}
      <Paper
        variant="outlined"
        sx={{
          flex: 1,
          borderRadius: 3,
          p: 2,
          maxHeight: 200,
          overflowY: "auto",
          backgroundColor: "#f9f9f9",
        }}
      >
        {chat.map((msg) => (
          <Box
            key={msg.id}
            display="flex"
            justifyContent={
              msg.senderId === socket.id ? "flex-end" : "flex-start"
            }
            mb={1.5}
          >
            <Paper
              elevation={2}
              sx={{
                maxWidth: "70%",
                p: 1.5,
                borderRadius: 3,
                bgcolor:
                  msg.senderId === socket.id ? "primary.main" : "grey.200",
                color: msg.senderId === socket.id ? "white" : "black",
              }}
            >
              <Typography variant="caption" sx={{ opacity: 0.7 }}>
                {msg.senderId === socket.id ? "אתה" : "שחקן אחר"} • {msg.time}
              </Typography>
              <Typography variant="body1">{msg.text}</Typography>
            </Paper>
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Paper>

      {/* שורת הקלט */}
      <Box display="flex" gap={1}>
        <TextField
          fullWidth
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="כתוב הודעה..."
          size="small"
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <Button variant="contained" onClick={sendMessage}>
          שלח
        </Button>
      </Box>
    </Box>
  );
};

export default ChatBox;
